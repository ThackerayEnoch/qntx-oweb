/**
 * QuantX Hero Canvas Configuration
 *
 * Central configuration for grid dimensions, timings, URLs, and visual rules.
 */

export const CANVAS_CONFIG = {
  canvasId: "qntx-ascii-canvas",
  progressContainerId: "canvas-progress",
  getStartedBtnId: "get-started-btn",

  // Grid dimensions
  desktop: {
    cols: 96,
    rows: 36,
  },
  mobile: {
    cols: 64,
    rows: 32,
    breakpoint: 640,
  },
  gap: 1, // 1px gap between cells
  poolSize: 900, // Maximum particles needed across all scenes
  tickRate: 30, // 30 ticks/second for mechanical whole-cell movement

  // Micro caption toggle: display "X402" under the payment coin in Scene 2
  SHOW_X402_LABEL: false,

  // Scene timings in milliseconds (~16.5s total loop)
  timings: {
    qntxIntro: 2000,
    sceneEarn: 4000,
    scenePay: 4500,
    sceneScale: 4000,
    qntxHold: 2000,
    buttonFlashDuration: 300,
    transition: 800, // Dissolve and regather transition duration
    maxStaggerDelay: 400, // Maximum random stagger delay for particles
    reducedMotionInterval: 3000, // Crossfade interval for prefers-reduced-motion
  },

  // Color tokens: strictly black and white (#000 and #fff)
  colors: {
    bg: "#ffffff",
    fg: "#000000",
  },
} as const;
