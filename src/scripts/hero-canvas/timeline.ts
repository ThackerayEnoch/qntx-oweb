/**
 * QuantX Hero Canvas Timeline Controller
 *
 * Coordinates playback, scene progression, looping, keyboard navigation, progress square indicator
 * state, and the hero:cta-flash DOM event.
 */

import { CANVAS_CONFIG } from "./config";
import { isSceneIndex, type SceneIndex } from "./types";

export type TimelinePhase =
  | "INTRO_BUILD" // First load 0.8s column-by-column build
  | "QNTX_HOLD" // 2.0s hold with double X flash and CTA event
  | "DISSOLVE_TO_SCENE_1" // 0.8s dissolve into Scene 1
  | "SCENE_1" // 4.0s EARN
  | "SCENE_2" // 4.5s PAY (direct continuation, NO dissolve)
  | "DISSOLVE_TO_SCENE_3" // 0.8s dissolve into Scene 3
  | "SCENE_3"; // 4.2s SCALE (multiplies, trades, dissolves to QNTX)

export type TimelineState = {
  phase: TimelinePhase;
  currentScene: SceneIndex | undefined; // undefined during QNTX hold and dissolve transitions
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

  private readonly onProgressChange?: (activeScene: SceneIndex | undefined) => void;

  constructor(onProgressChange?: (activeScene: SceneIndex | undefined) => void) {
    this.onProgressChange = onProgressChange;
  }

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
    if (this.phase === "SCENE_3") {
      return 2;
    }
    return undefined; // None filled during QNTX hold or dissolve
  }

  /**
   * Jump directly to a scene from progress indicator buttons or arrow keys. As specified: Scene 1
   * and 3 start with dissolve; Scene 2 starts without dissolve.
   */
  gotoScene(scene: SceneIndex): void {
    this.hasEmittedCtaFlash = false;

    if (scene === 0) {
      this.phase = "DISSOLVE_TO_SCENE_1";
      this.elapsedInPhase = 0;
    } else if (scene === 1) {
      // Scene 2 starts directly without dissolve
      this.phase = "SCENE_2";
      this.elapsedInPhase = 0;
    } else if (scene === 2) {
      this.phase = "DISSOLVE_TO_SCENE_3";
      this.elapsedInPhase = 0;
    }

    if (this.onProgressChange !== undefined) {
      this.onProgressChange(this.getCurrentScene());
    }
  }

  nextScene(): void {
    const current = this.getCurrentScene();
    const next = current === undefined ? 0 : (current + 1) % 3;
    if (isSceneIndex(next)) {
      this.gotoScene(next);
    }
  }

  prevScene(): void {
    const current = this.getCurrentScene();
    const prev = current === undefined ? 2 : (current + 2) % 3;
    if (isSceneIndex(prev)) {
      this.gotoScene(prev);
    }
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
            if (this.onProgressChange !== undefined) {
              this.onProgressChange(undefined);
            }
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
            this.phase = "DISSOLVE_TO_SCENE_1";
            this.elapsedInPhase = 0;
            if (this.onProgressChange !== undefined) {
              this.onProgressChange(undefined);
            }
          }
          break;
        }

        case "DISSOLVE_TO_SCENE_1": {
          if (this.elapsedInPhase >= CANVAS_CONFIG.timings.transition) {
            this.phase = "SCENE_1";
            this.elapsedInPhase = 0;
            if (this.onProgressChange !== undefined) {
              this.onProgressChange(0);
            }
          }
          break;
        }

        case "SCENE_1": {
          if (this.elapsedInPhase >= CANVAS_CONFIG.timings.scene1Earn) {
            // Continues directly to Scene 2 (NO dissolve)
            this.phase = "SCENE_2";
            this.elapsedInPhase = 0;
            if (this.onProgressChange !== undefined) {
              this.onProgressChange(1);
            }
          }
          break;
        }

        case "SCENE_2": {
          if (this.elapsedInPhase >= CANVAS_CONFIG.timings.scene2Pay) {
            // Dissolve into Scene 3
            this.phase = "DISSOLVE_TO_SCENE_3";
            this.elapsedInPhase = 0;
            if (this.onProgressChange !== undefined) {
              this.onProgressChange(undefined);
            }
          }
          break;
        }

        case "DISSOLVE_TO_SCENE_3": {
          if (this.elapsedInPhase >= CANVAS_CONFIG.timings.transition) {
            this.phase = "SCENE_3";
            this.elapsedInPhase = 0;
            if (this.onProgressChange !== undefined) {
              this.onProgressChange(2);
            }
          }
          break;
        }

        case "SCENE_3": {
          if (this.elapsedInPhase >= CANVAS_CONFIG.timings.scene3Scale) {
            // Loops back to QNTX hold
            this.phase = "QNTX_HOLD";
            this.elapsedInPhase = 0;
            this.hasEmittedCtaFlash = false;
            if (this.onProgressChange !== undefined) {
              this.onProgressChange(undefined);
            }
          }
          break;
        }
      }
    }

    const isTransitioning =
      this.phase === "DISSOLVE_TO_SCENE_1" ||
      this.phase === "DISSOLVE_TO_SCENE_3" ||
      (this.phase === "SCENE_3" && this.elapsedInPhase >= 3400);

    let transitionProgress = 1.0;
    if (this.phase === "DISSOLVE_TO_SCENE_1" || this.phase === "DISSOLVE_TO_SCENE_3") {
      transitionProgress = Math.min(1.0, this.elapsedInPhase / CANVAS_CONFIG.timings.transition);
    } else if (this.phase === "SCENE_3" && this.elapsedInPhase >= 3400) {
      transitionProgress = Math.min(1.0, (this.elapsedInPhase - 3400) / 800);
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
