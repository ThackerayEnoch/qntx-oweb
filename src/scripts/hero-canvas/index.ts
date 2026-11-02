/**
 * QuantX Hero Canvas Main Entrypoint & DOM Wiring
 *
 * Coordinates engine lifecycle, CTA flash listener, and Astro view transitions.
 */

import { CANVAS_CONFIG } from "./config";
import { HeroCanvasEngine } from "./engine";

let currentEngine: HeroCanvasEngine | undefined = undefined;
let ctaFlashCleanup: (() => void) | undefined = undefined;

/** Sets up GET STARTED button color inversion on hero:cta-flash event */
function wireCtaFlash(): void {
  if (ctaFlashCleanup !== undefined) {
    ctaFlashCleanup();
    ctaFlashCleanup = undefined;
  }

  const { ctaBtnSelector, timings } = CANVAS_CONFIG;
  const ctaBtn = document.querySelector<HTMLElement>(ctaBtnSelector);
  if (ctaBtn === null) {
    return;
  }

  let flashTimer: number | undefined = undefined;

  const handleFlash = (): void => {
    ctaBtn.classList.add("!bg-black", "!text-white");
    if (flashTimer !== undefined) {
      clearTimeout(flashTimer);
    }
    flashTimer = window.setTimeout(() => {
      ctaBtn.classList.remove("!bg-black", "!text-white");
    }, timings.ctaFlashDuration);
  };

  window.addEventListener("hero:cta-flash", handleFlash);

  ctaFlashCleanup = (): void => {
    window.removeEventListener("hero:cta-flash", handleFlash);
    if (flashTimer !== undefined) {
      clearTimeout(flashTimer);
    }
    ctaBtn.classList.remove("!bg-black", "!text-white");
  };
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

  const engine = new HeroCanvasEngine(canvasEl);
  currentEngine = engine;

  wireCtaFlash();

  return engine;
}

// Astro lifecycle integration
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
    if (ctaFlashCleanup !== undefined) {
      ctaFlashCleanup();
      ctaFlashCleanup = undefined;
    }
  });
}
