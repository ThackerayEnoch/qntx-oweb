/**
 * QuantX Hero Canvas Configuration
 *
 * Centralized declarative constants for logical stage, physical grid, stage positions, timings,
 * PRNG seed, and black/white palette.
 */

export const CANVAS_CONFIG = {
  canvasId: "qntx-ascii-canvas",
  progressContainerId: "canvas-progress",
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
  },

  // Fixed particle pool size (covers wordmark 920 cells + headroom)
  poolSize: 950,

  // Mechanical 30 ticks/second fixed timestep accumulator
  tickRate: 30,

  // PRNG seed for deterministic stagger and trading patterns
  prngSeed: 7771,

  // Stage Coordinates
  positions: {
    groundRow: 33, // Ground line (bottom row of agents and pile)
    agentRow: 25, // Agent top-left row (antenna at row 25, feet at row 33)
    oursCol: 36, // "Ours" agent top-left col (center col 40)
    otherCol: 84, // "Other" agent top-left col (center col 88)
    pileStartCol: 49, // Pile columns 49-55 (center col 52)
    pileEndCol: 55,
    pileBars: [33, 31, 29, 27] as const, // Rows for stacked coin bars from bottom to top
    coinRow: 22, // Center row of traveling 5x5 coin (rows 20-24)
    bubbleRowStart: 6, // Speech bubble outer box rows 6-18
    bubbleRowEnd: 18,
    bubbleTailRow1: 19,
    bubbleTailRow2: 20,
    resultIconRowStart: 11, // Result icon rows 11-19
    resultIconRowEnd: 19,
    scene3AgentRow: 16, // Scene 3 initial agent top-left (60, 16)
    scene3AgentCol: 60,
  },

  // Timings in milliseconds (Total loop: ~15.5s)
  timings: {
    qntxIntroBuild: 800, // First page load column-by-column build (0.8s)
    qntxHold: 2000, // QNTX hold duration (2.0s)
    qntxXFlashStart: 300, // Letter X flash starts at t=0.3s
    flashDuration: 120, // FLASH duration (120ms hollow, then filled)
    ctaFlashDuration: 250, // GET STARTED button color inversion (250ms)
    transition: 800, // Dissolve transition duration (0.8s)
    maxStaggerDelay: 400, // Max random stagger delay (up to 400ms)
    objectBuildDuration: 300, // Build flyout from antenna (~0.3s)
    objectDisappearDuration: 300, // Peeling / scale to 0 (~0.3s)

    scene1Earn: 4000, // Scene 1 duration (4.0s)
    scene2Pay: 4500, // Scene 2 duration (4.5s)
    scene3Scale: 4200, // Scene 3 duration (4.2s)

    scene3CoinInterval: 120, // Spawn mini coin every 120ms
    scene3CoinDuration: 280, // Coin travel duration between neighbors
    scene3MaxCoins: 10, // Max 10 coins in flight

    reducedMotionInterval: 3000, // Switch static frames every 3s
    reducedMotionFadeDuration: 300, // Canvas element opacity crossfade
  },

  // Black and white palette
  colors: {
    bg: "#ffffff",
    fg: "#000000",
  },
} as const;
