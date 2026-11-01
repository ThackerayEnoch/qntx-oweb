/**
 * QuantX Hero Canvas Main Entrypoint
 *
 * Initializes the canvas engine, wires up the 3-square progress indicator (EARN, PAY, SCALE), and
 * handles Astro view transition lifecycles.
 */

import { CANVAS_CONFIG } from "./config";
import { HeroCanvasEngine } from "./engine";
import { isSceneIndex, type SceneIndex } from "./types";

let currentEngine: HeroCanvasEngine | undefined = undefined;

function updateProgressIndicator(activeScene: SceneIndex): void {
  const container = document.getElementById(CANVAS_CONFIG.progressContainerId);
  if (container === null) {
    return;
  }

  const buttons = container.querySelectorAll<HTMLButtonElement>(".progress-square");
  buttons.forEach((btn, idx) => {
    if (idx === activeScene) {
      btn.classList.add("bg-black");
      btn.classList.remove("bg-transparent");
      btn.setAttribute("aria-current", "true");
    } else {
      btn.classList.remove("bg-black");
      btn.classList.add("bg-transparent");
      btn.removeAttribute("aria-current");
    }
  });
}

function setupProgressButtons(engine: HeroCanvasEngine): void {
  const container = document.getElementById(CANVAS_CONFIG.progressContainerId);
  if (container === null) {
    return;
  }

  const buttons = container.querySelectorAll<HTMLButtonElement>(".progress-square");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const sceneAttr = btn.getAttribute("data-scene");
      const sceneIdx = Number(sceneAttr);
      if (!isNaN(sceneIdx) && isSceneIndex(sceneIdx)) {
        engine.getTimeline().gotoScene(sceneIdx);
        updateProgressIndicator(sceneIdx);
      }
    });
  });
}

export function initHeroCanvas(): HeroCanvasEngine | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  // Cleanup existing engine if any
  if (currentEngine !== undefined) {
    currentEngine.destroy();
    currentEngine = undefined;
  }

  const canvasEl = document.getElementById(CANVAS_CONFIG.canvasId);
  if (!(canvasEl instanceof HTMLCanvasElement)) {
    return undefined;
  }

  const engine = new HeroCanvasEngine(canvasEl, (scene: SceneIndex) => {
    updateProgressIndicator(scene);
  });

  currentEngine = engine;
  setupProgressButtons(engine);
  updateProgressIndicator(0);

  return engine;
}

// Lifecycle integration with Astro
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initHeroCanvas();
    });
  } else {
    initHeroCanvas();
  }

  document.addEventListener("astro:page-load", () => {
    initHeroCanvas();
  });

  document.addEventListener("astro:before-swap", () => {
    if (currentEngine !== undefined) {
      currentEngine.destroy();
      currentEngine = undefined;
    }
  });
}
