/**
 * QuantX Hero Canvas Timeline Controller
 *
 * Coordinates playback, scene progression (EARN -> PAY -> SCALE -> QNTX hold), looping, keyboard
 * navigation, and button invert flash during QNTX hold.
 */

import { CANVAS_CONFIG } from "./config";
import { isSceneIndex, type SceneIndex } from "./types";

export type TimelineState = {
  currentScene: SceneIndex;
  elapsedInScene: number;
  isIntro: boolean;
  isQNTXHold: boolean;
  isTransitioning: boolean;
  transitionProgress: number; // 0..1
};

export class CanvasTimeline {
  private currentScene: SceneIndex = 0;
  private elapsedInScene = 0;
  private isIntro = true;
  private isPaused = false;
  private isTransitioning = false;
  private transitionElapsed = 0;
  private isButtonFlashing = false;

  private readonly sceneDurations: ReadonlyArray<number>;
  private readonly onSceneChangeCallback?: (scene: SceneIndex) => void;
  private readonly onButtonFlashCallback?: (flashing: boolean) => void;

  constructor(
    onSceneChange?: (scene: SceneIndex) => void,
    onButtonFlash?: (flashing: boolean) => void,
  ) {
    this.onSceneChangeCallback = onSceneChange;
    this.onButtonFlashCallback = onButtonFlash;

    // Scene 2 includes the 4s SCALE crowd scene + 2s QNTX hold = 6000ms
    this.sceneDurations = [
      CANVAS_CONFIG.timings.sceneEarn,
      CANVAS_CONFIG.timings.scenePay,
      CANVAS_CONFIG.timings.sceneScale + CANVAS_CONFIG.timings.qntxHold,
    ];
  }

  getScene(): SceneIndex {
    return this.currentScene;
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

  gotoScene(scene: SceneIndex): void {
    this.isIntro = false;
    this.setButtonFlash(false);

    if (scene === this.currentScene && !this.isTransitioning) {
      return;
    }

    this.currentScene = scene;
    this.elapsedInScene = 0;
    this.isTransitioning = true;
    this.transitionElapsed = 0;

    if (this.onSceneChangeCallback !== undefined) {
      this.onSceneChangeCallback(this.currentScene);
    }
  }

  nextScene(): void {
    const next = (this.currentScene + 1) % 3;
    if (isSceneIndex(next)) {
      this.gotoScene(next);
    }
  }

  prevScene(): void {
    const prev = (this.currentScene + 2) % 3;
    if (isSceneIndex(prev)) {
      this.gotoScene(prev);
    }
  }

  private setButtonFlash(flashing: boolean): void {
    if (this.isButtonFlashing !== flashing) {
      this.isButtonFlashing = flashing;
      if (this.onButtonFlashCallback !== undefined) {
        this.onButtonFlashCallback(flashing);
      }
    }
  }

  update(deltaMs: number): TimelineState {
    if (!this.isPaused) {
      // Intro QNTX playback (first load only, 2s)
      if (this.isIntro) {
        this.elapsedInScene += deltaMs;
        if (this.elapsedInScene >= CANVAS_CONFIG.timings.qntxIntro) {
          this.isIntro = false;
          this.gotoScene(0); // Proceed to Scene 0 (EARN)
        }
      } else {
        if (this.isTransitioning) {
          this.transitionElapsed += deltaMs;
          if (this.transitionElapsed >= CANVAS_CONFIG.timings.transition) {
            this.isTransitioning = false;
            this.transitionElapsed = CANVAS_CONFIG.timings.transition;
          }
        }

        this.elapsedInScene += deltaMs;
        const duration = this.sceneDurations[this.currentScene] ?? 4000;

        // Button invert flash check during QNTX hold in Scene 2
        if (this.currentScene === 2 && this.elapsedInScene >= CANVAS_CONFIG.timings.sceneScale) {
          const holdElapsed = this.elapsedInScene - CANVAS_CONFIG.timings.sceneScale;
          const flashStart = 400;
          const flashEnd = flashStart + CANVAS_CONFIG.timings.buttonFlashDuration;
          const shouldFlash = holdElapsed >= flashStart && holdElapsed <= flashEnd;
          this.setButtonFlash(shouldFlash);
        } else {
          this.setButtonFlash(false);
        }

        if (this.elapsedInScene >= duration) {
          this.setButtonFlash(false);
          this.nextScene();
        }
      }
    }

    const isQNTXHold =
      !this.isIntro &&
      this.currentScene === 2 &&
      this.elapsedInScene >= CANVAS_CONFIG.timings.sceneScale;

    const transitionProgress = this.isTransitioning
      ? Math.min(1, this.transitionElapsed / CANVAS_CONFIG.timings.transition)
      : 1;

    return {
      currentScene: this.currentScene,
      elapsedInScene: this.elapsedInScene,
      isIntro: this.isIntro,
      isQNTXHold,
      isTransitioning: this.isTransitioning,
      transitionProgress,
    };
  }
}
