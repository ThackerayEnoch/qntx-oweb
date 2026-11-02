/**
 * QuantX Hero Canvas Timeline Controller
 *
 * Coordinates playback, scene progression (QNTX Hold 2.0s -> Scene 1 8.0s -> Scene 2 4.0s -> Loop),
 * and dispatches the hero:cta-flash DOM event.
 */

import { CANVAS_CONFIG } from "./config";
import type { SceneIndex } from "./types";

export type TimelinePhase =
  | "INTRO_BUILD" // First load 0.8s column-by-column build
  | "QNTX_HOLD" // 2.0s hold with double X flash and CTA event
  | "SCENE_1" // 8.0s x402 Payment (starts with 0.8s dissolve)
  | "SCENE_2"; // 4.0s Crowd & Trading (starts with 0.6s dissolve, ends with 0.8s dissolve to QNTX)

export type TimelineState = {
  phase: TimelinePhase;
  currentScene: SceneIndex | undefined;
  elapsedInPhase: number;
  isPaused: boolean;
  isTransitioning: boolean;
  transitionProgress: number; // 0..1
};

export class CanvasTimeline {
  private phase: TimelinePhase = "INTRO_BUILD";
  private elapsedInPhase = 0;
  private isPaused = false;
  private hasEmittedCtaFlash = false;

  isPausedState(): boolean {
    return this.isPaused;
  }

  pause(): void {
    this.isPaused = true;
  }

  resume(): void {
    this.isPaused = false;
  }

  togglePause(): void {
    this.isPaused = !this.isPaused;
  }

  getPhase(): TimelinePhase {
    return this.phase;
  }

  getCurrentScene(): SceneIndex | undefined {
    if (this.phase === "SCENE_1") {
      return 0;
    }
    if (this.phase === "SCENE_2") {
      return 1;
    }
    return undefined;
  }

  private emitCtaFlash(): void {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hero:cta-flash"));
    }
  }

  update(deltaMs: number): TimelineState {
    if (!this.isPaused) {
      this.elapsedInPhase += deltaMs;

      switch (this.phase) {
        case "INTRO_BUILD": {
          if (this.elapsedInPhase >= CANVAS_CONFIG.timings.qntxIntroBuild) {
            this.phase = "QNTX_HOLD";
            this.elapsedInPhase = 0;
            this.hasEmittedCtaFlash = false;
          }
          break;
        }

        case "QNTX_HOLD": {
          // Emit hero:cta-flash event at t=0.3s
          if (
            !this.hasEmittedCtaFlash &&
            this.elapsedInPhase >= CANVAS_CONFIG.timings.qntxXFlashStart
          ) {
            this.hasEmittedCtaFlash = true;
            this.emitCtaFlash();
          }

          if (this.elapsedInPhase >= CANVAS_CONFIG.timings.qntxHold) {
            this.phase = "SCENE_1";
            this.elapsedInPhase = 0;
          }
          break;
        }

        case "SCENE_1": {
          if (this.elapsedInPhase >= CANVAS_CONFIG.timings.scene1Duration) {
            this.phase = "SCENE_2";
            this.elapsedInPhase = 0;
          }
          break;
        }

        case "SCENE_2": {
          if (this.elapsedInPhase >= CANVAS_CONFIG.timings.scene2Duration) {
            // Loops back to QNTX hold
            this.phase = "QNTX_HOLD";
            this.elapsedInPhase = 0;
            this.hasEmittedCtaFlash = false;
          }
          break;
        }
      }
    }

    // Dissolve transition states
    let isTransitioning = false;
    let transitionProgress = 1.0;

    if (this.phase === "SCENE_1" && this.elapsedInPhase < CANVAS_CONFIG.timings.scene1Dissolve) {
      isTransitioning = true;
      transitionProgress = Math.min(
        1.0,
        this.elapsedInPhase / CANVAS_CONFIG.timings.scene1Dissolve,
      );
    } else if (this.phase === "SCENE_2") {
      if (this.elapsedInPhase < CANVAS_CONFIG.timings.scene2Dissolve) {
        isTransitioning = true;
        transitionProgress = Math.min(
          1.0,
          this.elapsedInPhase / CANVAS_CONFIG.timings.scene2Dissolve,
        );
      } else if (this.elapsedInPhase >= 3200) {
        isTransitioning = true;
        transitionProgress = Math.min(
          1.0,
          (this.elapsedInPhase - 3200) / CANVAS_CONFIG.timings.scene2DissolveOut,
        );
      }
    }

    return {
      phase: this.phase,
      currentScene: this.getCurrentScene(),
      elapsedInPhase: this.elapsedInPhase,
      isPaused: this.isPaused,
      isTransitioning,
      transitionProgress,
    };
  }
}
