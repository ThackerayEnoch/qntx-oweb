/**
 * QuantX Hero Canvas Main Entrypoint
 *
 * Initializes the canvas engine and handles Astro view transition lifecycles.
 */

import { CANVAS_CONFIG } from "./config";
import { HeroCanvasEngine } from "./engine";

let currentEngine: HeroCanvasEngine | undefined = undefined;

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

  const engine = new HeroCanvasEngine(canvasEl);
  currentEngine = engine;

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
