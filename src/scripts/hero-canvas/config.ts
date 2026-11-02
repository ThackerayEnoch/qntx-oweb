/**
 * QuantX Hero Canvas Configuration
 *
 * Centralized declarative constants for logical stage, physical grid, positions, timings, speeds
 * (integer cells per tick), PRNG seed, and black/white palette.
 */

export const CANVAS_CONFIG = {
  canvasId: "qntx-ascii-canvas",
  ctaBtnSelector: "[data-hero-cta]",

  // Logical STAGE: 128 cols x 40 rows
  stage: {
    cols: 128,
    rows: 40,
    centerCol: 64,
    centerRow: 20,
  },

  // Physical grid layout
  grid: {
    cellSize: 6, // 6px square cells
    gap: 1, // 1px gap between cells
    minCols: 32,
    minRows: 20,
    mobileBreakpoint: 640,
    minK: 0.6, // k = max(0.6, realCols / 128)
  },

  // Fixed particle pool size (covers wordmark 1446 cells + headroom)
  poolSize: 1600,

  // Mechanical 30 ticks/second fixed timestep accumulator
  tickRate: 30,

  // PRNG seed for deterministic stagger and trading patterns
  prngSeed: 4021,

  // Stage Coordinates
  positions: {
    groundRow: 33, // Ground line (bottom row of agents: row 33)
    agentRow: 25, // Full-size agent top row (rows 25-33, height 9)
    agentACol: 36, // Agent A top-left col (center col 40, width 9)
    agentBCol: 84, // Agent B top-left col (center col 88, width 9)
    coinRow: 22, // Coin travel line center row (rows 20-24)
    jumpOnReceive: false, // Optional jump on receiving coin/icon
    bubbleRowStart: 6, // Speech bubble outer box rows 6-18 (height 13)
    bubbleRowEnd: 18,
    bubbleTailRow1: 19,
    bubbleTailRow2: 20,
    resultIconRowStart: 11, // Result icon rows 11-19 (height 9)
    resultIconRowEnd: 19,
    checkMarkColStart: 49, // Check mark cols 49-55 (width 7)
    checkMarkColEnd: 55,
    checkMarkRowStart: 13, // Check mark rows 13-17 (height 5)
    checkMarkRowEnd: 17,
    scene2AgentRow: 16, // Scene 2 centered initial agent top-left (60, 16)
    scene2AgentCol: 60,
  },

  // Speeds in integer cells per tick (at 30 ticks/second)
  speeds: {
    bubbleMove: 2, // 48 cells in 24 ticks (0.8s) = 2 cells/tick
    coinMove: 4, // 48 cells in 12 ticks (0.4s) = 4 cells/tick
    iconMove: 2, // 48 cells in 24 ticks (0.8s) = 2 cells/tick
  },

  // Timings in milliseconds (Total loop: ~14.0s)
  timings: {
    qntxIntroBuild: 800, // First page load column-by-column build (0.8s)
    qntxHold: 2000, // QNTX hold duration (2.0s)
    qntxXFlashStart: 300, // Letter X flash starts at t=0.3s
    flashDuration: 120, // FLASH duration (120ms hollow, then filled)
    ctaFlashDuration: 250, // GET STARTED button color inversion (250ms)

    scene1Duration: 8000, // Scene 1 duration (8.0s)
    scene1Dissolve: 800, // Dissolve from QNTX into agents A and B (0.8s)

    scene2Duration: 4000, // Scene 2 duration (4.0s)
    scene2Dissolve: 600, // Dissolve into one centered agent (0.6s)
    scene2DissolveOut: 800, // Dissolve crowd into QNTX wordmark (0.8s)

    scene2CoinInterval: 60, // Spawn mini coin every 60ms (high interaction frequency)
    scene2CoinDuration: 240, // Coin travel duration between neighbors
    scene2MaxCoins: 16, // Max 16 coins in flight

    maxStaggerDelay: 400, // Max random stagger delay (up to 400ms)
    objectBuildDuration: 300, // Flyout build from sender head (~0.3s)
    objectVanishDuration: 200, // Scale to 0 with random stagger (~0.2s)

    reducedMotionInterval: 3000, // Switch static frames every 3s
    reducedMotionFadeDuration: 300, // Canvas element opacity crossfade
  },

  // Black and white palette
  colors: {
    bg: "#ffffff",
    fg: "#000000",
  },
} as const;
