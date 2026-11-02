/**
 * QuantX Hero Canvas Scene Frame Generator
 *
 * Implements the two-scene narrative: QNTX Wordmark -> Scene 1 (x402 Payment, 8.0s) -> Scene 2
 * (Crowd & Trading, 4.0s) -> QNTX Hold.
 *
 * Strict grid alignment, whole-cell snapping, and deterministic PRNG.
 */

import { QNTX_SQUARES } from "../qntx-data";
import { CANVAS_CONFIG } from "./config";
import { createPRNG } from "./particles";
import {
  applyBuildEffect,
  applyVanishEffect,
  getAgentCells,
  getGlyphTextCells,
  getMiniAgentCells,
  getPaymentBubbleContentCells,
  getSpeechBubbleCells,
  getThinkingDots,
  SPRITE_CHECK_MARK,
  SPRITE_COIN,
  SPRITE_MINI_COIN,
  SPRITE_PICTURE_ICON,
  spriteToCells,
} from "./sprites";
import type { Beat, Cell, SceneFrame } from "./types";

/** Data-driven scene beat descriptors for tweaking */
export const SCENE_1_BEATS: ReadonlyArray<Beat> = [
  { name: "DISSOLVE_IN", startMs: 0, endMs: 800 },
  { name: "REQUEST_BUBBLE_BUILD", startMs: 800, endMs: 1100 },
  { name: "REQUEST_BUBBLE_MOVE", startMs: 1100, endMs: 1900 },
  { name: "REQUEST_BUBBLE_ARRIVE", startMs: 1900, endMs: 2000 },
  { name: "REQUEST_BUBBLE_VANISH", startMs: 2000, endMs: 2300 },
  { name: "PAYMENT_BUBBLE_BUILD", startMs: 2300, endMs: 2600 },
  { name: "PAYMENT_BUBBLE_MOVE", startMs: 2600, endMs: 3400 },
  { name: "PAYMENT_BUBBLE_HOLD", startMs: 3400, endMs: 4500 },
  { name: "PAYMENT_BUBBLE_VANISH_TEXT", startMs: 4500, endMs: 4700 },
  { name: "COIN_DROP_TO_LINE", startMs: 4700, endMs: 4800 },
  { name: "COIN_TRAVEL_TO_B", startMs: 4800, endMs: 5200 },
  { name: "COIN_MERGE_B_FLASH", startMs: 5200, endMs: 5300 },
  { name: "B_THINKING", startMs: 5300, endMs: 6000 },
  { name: "PICTURE_BUILD", startMs: 6000, endMs: 6300 },
  { name: "PICTURE_MOVE_TO_A", startMs: 6300, endMs: 7100 },
  { name: "CHECK_MARK_BUILD", startMs: 7100, endMs: 7400 },
  { name: "A_HAPPY_HOLD", startMs: 7400, endMs: 8000 },
];

/**
 * Maps a stage column coordinate using horizontal compression factor k = max(0.6, realCols / 128).
 * Every x-distance measured from stage center (col 64) is scaled by k, rounded to integers.
 */
export function getCompressedCol(stageCol: number, k: number): number {
  if (k >= 1.0) {
    return stageCol;
  }
  return 64 + Math.round((stageCol - 64) * k);
}

/**
 * Centered QNTX Wordmark Frame (reusing exact QNTX_SQUARES cell data). On first page load: builds
 * column by column over 0.8s. During hold: letter X flashes twice at t=0.3s (120ms hollow, 120ms
 * filled, 120ms hollow).
 */
export function getQntxFrame(elapsedMs: number, isIntro: boolean, k: number): SceneFrame {
  const cells: Cell[] = [];
  // QNTX wordmark is 84 wide x 18 tall. Centered on stage:
  // startCol = 64 - 42 = 22, startRow = 20 - 9 = 11.
  const baseStartCol = 22;
  const startRow = 11;

  // Intro: column-by-column build from left to right over 0.8s
  let maxColAllowed = 84;
  if (isIntro) {
    const progress = Math.min(1, elapsedMs / CANVAS_CONFIG.timings.qntxIntroBuild);
    maxColAllowed = Math.floor(progress * 84);
  }

  // Double flash on letter X during hold (starting at t=300ms)
  // Letter X is columns 66..83
  let isXFlashing = false;
  if (!isIntro) {
    const { qntxXFlashStart, flashDuration } = CANVAS_CONFIG.timings;
    const inFlash1 = elapsedMs >= qntxXFlashStart && elapsedMs < qntxXFlashStart + flashDuration;
    const inFlash2 =
      elapsedMs >= qntxXFlashStart + flashDuration * 2 &&
      elapsedMs < qntxXFlashStart + flashDuration * 3;
    isXFlashing = inFlash1 || inFlash2;
  }

  for (const [localCol, localRow] of QNTX_SQUARES) {
    if (isIntro && localCol > maxColAllowed) {
      continue;
    }

    const isLetterX = localCol >= 66;
    const state = isLetterX && isXFlashing ? "hollow" : "filled";

    // Stage column centered with compression factor k
    const stageCol = baseStartCol + localCol;
    const col = getCompressedCol(stageCol, k);
    const row = startRow + localRow;

    cells.push({
      col,
      row,
      state,
      scale: 1.0,
    });
  }

  return { cells };
}

/**
 * Scene 1: x402 PAYMENT (8.0s) Story: A asks B for an image. B answers "payment required, x402". A
 * pays with a coin. B delivers the picture and check mark.
 */
export function getScene1PaymentFrame(elapsedMs: number, k: number): SceneFrame {
  const cells: Cell[] = [];
  const { agentRow, checkMarkColStart, checkMarkRowStart } = CANVAS_CONFIG.positions;
  const centerA = getCompressedCol(40, k);
  const topColA = centerA - 5; // 11 wide -> topCol = center - 5
  const centerB = getCompressedCol(88, k);
  const topColB = centerB - 5;

  let eyeA: "open" | "blink" | "happy" = "open";
  let eyeB: "open" | "blink" | "happy" = "open";
  let flashA = false;
  let flashB = false;

  // 1. Request Bubble (A wants an image) (0.8s - 2.3s)
  if (elapsedMs >= 800 && elapsedMs < 1100) {
    // 0.8-1.1s: builds above A
    const bubbleCells = getSpeechBubbleCells(centerA);
    const picCells = spriteToCells(SPRITE_PICTURE_ICON, centerA - 5, 8);
    const combined = [...bubbleCells, ...picCells];
    cells.push(...applyBuildEffect(combined, centerA, agentRow, (elapsedMs - 800) / 300));
  } else if (elapsedMs >= 1100 && elapsedMs < 1900) {
    // 1.1-1.9s: moves horizontally right to B (2 cells per tick)
    const p = (elapsedMs - 1100) / 800;
    const currentCenter = Math.round(centerA + (centerB - centerA) * p);
    cells.push(...getSpeechBubbleCells(currentCenter));
    cells.push(...spriteToCells(SPRITE_PICTURE_ICON, currentCenter - 5, 8));
  } else if (elapsedMs >= 1900 && elapsedMs < 2000) {
    // 1.9-2.0s: arrives above B, B FLASHes
    cells.push(...getSpeechBubbleCells(centerB));
    cells.push(...spriteToCells(SPRITE_PICTURE_ICON, centerB - 5, 8));
    flashB = true;
  } else if (elapsedMs >= 2000 && elapsedMs < 2300) {
    // 2.0-2.3s: bubble vanishes
    const bubbleCells = getSpeechBubbleCells(centerB);
    const picCells = spriteToCells(SPRITE_PICTURE_ICON, centerB - 5, 8);
    const combined = [...bubbleCells, ...picCells];
    cells.push(...applyVanishEffect(combined, (elapsedMs - 2000) / 300, 101));
    if (elapsedMs < 1900 + CANVAS_CONFIG.timings.flashDuration) {
      flashB = true;
    }
  }

  // 2. Payment-Required Bubble (B answers "x402") (2.3s - 4.7s)
  if (elapsedMs >= 2300 && elapsedMs < 2600) {
    // 2.3-2.6s: builds above B
    const bubbleCells = getSpeechBubbleCells(centerB);
    const contentCells = getPaymentBubbleContentCells(centerB, 10);
    const combined = [...bubbleCells, ...contentCells];
    cells.push(...applyBuildEffect(combined, centerB, agentRow, (elapsedMs - 2300) / 300));
  } else if (elapsedMs >= 2600 && elapsedMs < 3400) {
    // 2.6-3.4s: moves left to A
    const p = (elapsedMs - 2600) / 800;
    const currentCenter = Math.round(centerB + (centerA - centerB) * p);
    cells.push(...getSpeechBubbleCells(currentCenter));
    cells.push(...getPaymentBubbleContentCells(currentCenter, 10));
  } else if (elapsedMs >= 3400 && elapsedMs < 4500) {
    // 3.4-4.5s: HOLDS still above A; A BLINKs once at t=3.9s
    cells.push(...getSpeechBubbleCells(centerA));
    cells.push(...getPaymentBubbleContentCells(centerA, 10));
    if (elapsedMs >= 3900 && elapsedMs < 4000) {
      eyeA = "blink";
    }
  } else if (elapsedMs >= 4500 && elapsedMs < 4700) {
    // 4.5-4.7s: border, tail and "x402" text vanish; coin stays!
    const bubbleCells = getSpeechBubbleCells(centerA);
    const textCells = getGlyphTextCells(centerA - 4, 10);
    const vanishing = [...bubbleCells, ...textCells];
    cells.push(...applyVanishEffect(vanishing, (elapsedMs - 4500) / 200, 202));

    // Coin stays still at row 10
    cells.push(...spriteToCells(SPRITE_COIN, centerA - 11, 10));
  }

  // 3. Coin Payment (4.7s - 5.3s)
  if (elapsedMs >= 4700 && elapsedMs < 4800) {
    // 4.7-4.8s: moves straight down to row 22, aligned with center A
    const p = (elapsedMs - 4700) / 100;
    const currentRow = Math.round(10 + (20 - 10) * p);
    const currentCol = Math.round(centerA - 11 + (centerA - 2 - (centerA - 11)) * p);
    cells.push(...spriteToCells(SPRITE_COIN, currentCol, currentRow));
  } else if (elapsedMs >= 4800 && elapsedMs < 5200) {
    // 4.8-5.2s: moves right at constant speed (4 cells per tick) until centered above B
    const p = (elapsedMs - 4800) / 400;
    const currentCol = Math.round(centerA - 2 + (centerB - 2 - (centerA - 2)) * p);
    cells.push(...spriteToCells(SPRITE_COIN, currentCol, 20));
  } else if (elapsedMs >= 5200 && elapsedMs < 5300) {
    // 5.2-5.3s: cells shrink to 0 into B while B FLASHes
    const p = (elapsedMs - 5200) / 100;
    const scale = Math.max(0, 1.0 - p);
    cells.push(...spriteToCells(SPRITE_COIN, centerB - 2, 20, "filled", scale));
    flashB = true;
  }

  // 4. B Thinking (5.3s - 6.0s)
  if (elapsedMs >= 5300 && elapsedMs < 6000) {
    cells.push(...getThinkingDots(centerB, agentRow, elapsedMs - 5300));
    if (elapsedMs >= 5700 && elapsedMs < 5800) {
      eyeB = "blink";
    }
  }

  // 5. Picture Icon Delivery (6.0s - 7.1s)
  if (elapsedMs >= 6000 && elapsedMs < 6300) {
    // 6.0-6.3s: builds above B at rows 11-19
    const picCells = spriteToCells(SPRITE_PICTURE_ICON, centerB - 5, 11);
    cells.push(...applyBuildEffect(picCells, centerB, agentRow, (elapsedMs - 6000) / 300));
  } else if (elapsedMs >= 6300 && elapsedMs < 7100) {
    // 6.3-7.1s: moves left at constant speed (2 cells per tick) to above A
    const p = (elapsedMs - 6300) / 800;
    const currentCenter = Math.round(centerB + (centerA - centerB) * p);
    cells.push(...spriteToCells(SPRITE_PICTURE_ICON, currentCenter - 5, 11));
  } else if (elapsedMs >= 7100) {
    // Holds above A
    cells.push(...spriteToCells(SPRITE_PICTURE_ICON, centerA - 5, 11));
  }

  // 6. Check Mark & A Happy (7.1s - 8.0s)
  if (elapsedMs >= 7100) {
    const checkTarget = spriteToCells(
      SPRITE_CHECK_MARK,
      getCompressedCol(checkMarkColStart, k),
      checkMarkRowStart,
    );

    if (elapsedMs < 7400) {
      // 7.1-7.4s: check mark builds
      cells.push(...applyBuildEffect(checkTarget, centerA, agentRow, (elapsedMs - 7100) / 300));
    } else {
      cells.push(...checkTarget);
      eyeA = "happy";
      if (elapsedMs < 7400 + CANVAS_CONFIG.timings.flashDuration) {
        flashA = true;
      }
    }
  }

  // Agents A and B
  cells.push(...getAgentCells(topColA, agentRow, eyeA, flashA));
  cells.push(...getAgentCells(topColB, agentRow, eyeB, flashB));

  return { cells };
}

/** Precomputed deterministic trading transactions for Scene 2 */
type ScheduledTrade = {
  spawnMs: number;
  fromIdx: number;
  toIdx: number;
};

function generateTradingSchedule(
  numCols: number,
  numRows: number,
  seed: number = CANVAS_CONFIG.prngSeed,
): ScheduledTrade[] {
  const prng = createPRNG(seed);
  const trades: ScheduledTrade[] = [];
  const startMs = 1800;
  const endMs = 3200;
  const interval = CANVAS_CONFIG.timings.scene2CoinInterval; // 120ms

  for (let t = startMs; t < endMs; t += interval) {
    const r = Math.floor(prng() * numRows);
    const c = Math.floor(prng() * numCols);
    const fromIdx = r * numCols + c;

    // Pick a valid orthogonal neighbor
    const neighbors: number[] = [];
    if (c > 0) {
      neighbors.push(r * numCols + (c - 1)); // Left
    }
    if (c < numCols - 1) {
      neighbors.push(r * numCols + (c + 1)); // Right
    }
    if (r > 0) {
      neighbors.push((r - 1) * numCols + c); // Up
    }
    if (r < numRows - 1) {
      neighbors.push((r + 1) * numCols + c); // Down
    }

    if (neighbors.length > 0) {
      const neighborIdx = Math.floor(prng() * neighbors.length);
      const toIdx = neighbors[neighborIdx] ?? fromIdx;
      trades.push({ spawnMs: t, fromIdx, toIdx });
    }
  }

  return trades;
}

/**
 * Scene 2: A CROWD OF AGENTS (4.0s) 0.0-0.6s: Dissolve from Scene 1 into ONE full-size agent
 * centered at (59, 16). 0.6-1.8s: Multiplies in 3 steps: 1 -> 3 -> 9 -> 27 MINI agents. 1.8-3.2s:
 * Trading! Mini coins (2x2) fly between adjacent agents; receivers FLASH on arrival. 3.2-4.0s:
 * Dissolve into QNTX wordmark.
 */
export function getScene2CrowdFrame(elapsedMs: number, isMobile: boolean, k: number): SceneFrame {
  const cells: Cell[] = [];
  const numRows = 3;
  const rowCenters = [9, 20, 31];

  // Grid columns
  const standardCols = [16, 28, 40, 52, 64, 76, 88, 100, 112];
  const mobileCols = [16, 40, 64, 88, 112];
  const colCenters = (isMobile ? mobileCols : standardCols).map((c) => getCompressedCol(c, k));
  const numCols = colCenters.length;

  if (elapsedMs < 600) {
    // 0.0-0.6s: Single full-size agent centered at (59, 16)
    const centerCol = getCompressedCol(64, k);
    cells.push(...getAgentCells(centerCol - 5, 16, "open", false));
    return { cells };
  }

  if (elapsedMs < 1000) {
    // Step 1 (0.6-1.0s): 1 -> 3 mini agents on middle row (row 20)
    const p = (elapsedMs - 600) / 400;
    const midCol = getCompressedCol(64, k);
    const leftTarget = getCompressedCol(52, k);
    const rightTarget = getCompressedCol(76, k);

    // Center agent shrinks to mini: top-left = center - (3, 2)
    cells.push(...getMiniAgentCells(midCol - 3, 18));

    // Left and right peel from center
    const leftCol = Math.round(midCol + (leftTarget - midCol) * p);
    const rightCol = Math.round(midCol + (rightTarget - midCol) * p);
    cells.push(...getMiniAgentCells(leftCol - 3, 18));
    cells.push(...getMiniAgentCells(rightCol - 3, 18));

    return { cells };
  }

  if (elapsedMs < 1400) {
    // Step 2 (1.0-1.4s): 3 -> 9 mini agents (3x3 grid)
    const p = (elapsedMs - 1000) / 400;
    const cols3 = [getCompressedCol(40, k), getCompressedCol(64, k), getCompressedCol(88, k)];

    for (const c of cols3) {
      // Middle row
      cells.push(...getMiniAgentCells(c - 3, 18));

      // Top row peels up from 20 to 9
      const topRow = Math.round(20 + (9 - 20) * p);
      cells.push(...getMiniAgentCells(c - 3, topRow - 2));

      // Bottom row peels down from 20 to 31
      const bottomRow = Math.round(20 + (31 - 20) * p);
      cells.push(...getMiniAgentCells(c - 3, bottomRow - 2));
    }

    return { cells };
  }

  if (elapsedMs < 1800) {
    // Step 3 (1.4-1.8s): 9 -> 27 mini agents crowd
    const p = (elapsedMs - 1400) / 400;
    for (let r = 0; r < numRows; r++) {
      const rowCenter = rowCenters[r] ?? 20;
      for (let c = 0; c < numCols; c++) {
        const targetCol = colCenters[c] ?? 64;
        const startCol = getCompressedCol(64, k);
        const currentCol = Math.round(startCol + (targetCol - startCol) * p);
        cells.push(...getMiniAgentCells(currentCol - 3, rowCenter - 2));
      }
    }
    return { cells };
  }

  // 1.8-3.2s: Trading Phase
  const trades = generateTradingSchedule(numCols, numRows);
  const coinDur = CANVAS_CONFIG.timings.scene2CoinDuration; // 280ms
  const flashDur = CANVAS_CONFIG.timings.flashDuration; // 120ms

  // Track which agents are flashing at this timestamp
  const flashingAgents = new Set<number>();

  for (const trade of trades) {
    const elapsedTrade = elapsedMs - trade.spawnMs;
    if (elapsedTrade >= coinDur && elapsedTrade < coinDur + flashDur) {
      flashingAgents.add(trade.toIdx);
    }
  }

  // Draw all mini agents in the crowd
  for (let r = 0; r < numRows; r++) {
    const rowCenter = rowCenters[r] ?? 20;
    for (let c = 0; c < numCols; c++) {
      const agentIdx = r * numCols + c;
      const colCenter = colCenters[c] ?? 64;
      const isFlash = flashingAgents.has(agentIdx);
      cells.push(...getMiniAgentCells(colCenter - 3, rowCenter - 2, isFlash));
    }
  }

  // Draw active traveling 2x2 mini coins (max 10 in flight)
  let activeCoins = 0;
  for (const trade of trades) {
    const elapsedTrade = elapsedMs - trade.spawnMs;
    if (elapsedTrade >= 0 && elapsedTrade < coinDur) {
      if (activeCoins >= CANVAS_CONFIG.timings.scene2MaxCoins) {
        break;
      }
      activeCoins++;

      const p = elapsedTrade / coinDur;
      const fromR = Math.floor(trade.fromIdx / numCols);
      const fromC = trade.fromIdx % numCols;
      const toR = Math.floor(trade.toIdx / numCols);
      const toC = trade.toIdx % numCols;

      const fromX = colCenters[fromC] ?? 64;
      const fromY = rowCenters[fromR] ?? 20;
      const toX = colCenters[toC] ?? 64;
      const toY = rowCenters[toR] ?? 20;

      const coinX = Math.round(fromX + (toX - fromX) * p);
      const coinY = Math.round(fromY + (toY - fromY) * p);

      cells.push(...spriteToCells(SPRITE_MINI_COIN, coinX - 1, coinY - 1));
    }
  }

  return { cells };
}

/** Static frame for reduced motion mode: Scene 1 at t=3.9s */
export function getReducedMotionScene1Frame(k: number): SceneFrame {
  const cells: Cell[] = [];
  const { agentRow } = CANVAS_CONFIG.positions;
  const centerA = getCompressedCol(40, k);
  const centerB = getCompressedCol(88, k);

  // Agent A with blink at 3.9s
  cells.push(...getAgentCells(centerA - 5, agentRow, "blink", false));
  // Agent B open
  cells.push(...getAgentCells(centerB - 5, agentRow, "open", false));

  // Payment-required bubble held still above Agent A
  cells.push(...getSpeechBubbleCells(centerA));
  cells.push(...getPaymentBubbleContentCells(centerA, 10));

  return { cells };
}
