/**
 * QuantX Hero Canvas Scene Frame Generator
 *
 * Implements the 3-scene narrative without any text: QNTX Wordmark -> Scene 1 (EARN) -> Scene 2
 * (PAY) -> Scene 3 (SCALE) -> QNTX Hold.
 *
 * Symmetrically centered, strictly grid-aligned, linear motion with whole-cell snapping.
 */

import { QNTX_SQUARES } from "../qntx-data";
import { CANVAS_CONFIG } from "./config";
import { createPRNG } from "./particles";
import {
  applyBuildEffect,
  applyDisappearEffect,
  getAgentCells,
  getMiniAgentCells,
  getPileCells,
  getSpeechBubbleCells,
  getThinkingDots,
  SPRITE_CHECK_MARK,
  SPRITE_COIN,
  SPRITE_DOCUMENT_ICON,
  SPRITE_MINI_COIN,
  SPRITE_PICTURE_ICON,
  spriteToCells,
} from "./sprites";
import type { Cell, SceneFrame } from "./types";

/**
 * Maps a stage column coordinate using horizontal compression factor k. Every x-distance measured
 * from stage center (col 64) is scaled by k, rounded to integers.
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
    const flashStart = CANVAS_CONFIG.timings.qntxXFlashStart; // 300
    const flashDur = CANVAS_CONFIG.timings.flashDuration; // 120
    const inFlash1 = elapsedMs >= flashStart && elapsedMs < flashStart + flashDur;
    const inFlash2 =
      elapsedMs >= flashStart + flashDur * 2 && elapsedMs < flashStart + flashDur * 3;
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
 * Scene 1: EARN (4.0s) Initial: Ours at (36, 25), Other at (84, 25), pile of 2 bars. 0.0-0.5s:
 * Bubble with DOCUMENT icon builds above Other. 0.5-1.2s: Bubble moves left to above Ours.
 * 1.2-1.5s: Bubble disappears (scale to 0). 1.5-2.5s: Ours thinks (dots cycle), BLINK once at
 * t=2.0s. 2.5-3.3s: Coin #1 spawns, moves along row 22, drops to pile (3 bars). Ours HAPPY &
 * FLASHes. Coin #2 follows 0.35s later (4 bars). 3.3-4.0s: Hold (pile 4 bars, Ours HAPPY).
 */
export function getScene1EarnFrame(elapsedMs: number, k: number): SceneFrame {
  const cells: Cell[] = [];
  const { agentRow } = CANVAS_CONFIG.positions;
  const oursCenterCol = getCompressedCol(40, k);
  const oursTopCol = oursCenterCol - 4;
  const otherCenterCol = getCompressedCol(88, k);
  const otherTopCol = otherCenterCol - 4;
  const pileCenterCol = getCompressedCol(52, k);

  let oursEye: "open" | "blink" | "happy" = "open";
  let oursFlash = false;
  let pileBars = 2;

  // 1. Bubble & Document Icon
  if (elapsedMs < 500) {
    // 0.0-0.5s: builds above Other from antenna (otherCenterCol, 25)
    const bubbleCells = getSpeechBubbleCells(otherCenterCol);
    const docIconCells = spriteToCells(SPRITE_DOCUMENT_ICON, otherCenterCol - 3, 8);
    const combined = [...bubbleCells, ...docIconCells];
    cells.push(...applyBuildEffect(combined, otherCenterCol, agentRow, elapsedMs / 500));
  } else if (elapsedMs < 1200) {
    // 0.5-1.2s: moves horizontally left to Ours
    const p = (elapsedMs - 500) / 700;
    const currentCenter = Math.round(otherCenterCol + (oursCenterCol - otherCenterCol) * p);
    cells.push(...getSpeechBubbleCells(currentCenter));
    cells.push(...spriteToCells(SPRITE_DOCUMENT_ICON, currentCenter - 3, 8));
  } else if (elapsedMs < 1500) {
    // 1.2-1.5s: disappears above Ours
    const bubbleCells = getSpeechBubbleCells(oursCenterCol);
    const docIconCells = spriteToCells(SPRITE_DOCUMENT_ICON, oursCenterCol - 3, 8);
    const combined = [...bubbleCells, ...docIconCells];
    cells.push(...applyDisappearEffect(combined, (elapsedMs - 1200) / 300, 101));
  }

  // 2. Thinking Dots & Blink
  if (elapsedMs >= 1500 && elapsedMs < 2500) {
    cells.push(...getThinkingDots(oursCenterCol, agentRow, elapsedMs - 1500));
    if (elapsedMs >= 2000 && elapsedMs < 2100) {
      oursEye = "blink";
    }
  }

  // 3. Coins & Payment
  if (elapsedMs >= 2500) {
    // Coin #1: starts at 2500ms
    if (elapsedMs < 2850) {
      // Moves left along row 22 to col 52
      const p = (elapsedMs - 2500) / 350;
      const coinCol = Math.round(otherCenterCol + (pileCenterCol - otherCenterCol) * p);
      cells.push(...spriteToCells(SPRITE_COIN, coinCol - 2, 20));
      pileBars = 2;
    } else if (elapsedMs < 2950) {
      // Drops from row 22 to row 29 onto pile
      const p = (elapsedMs - 2850) / 100;
      const coinRow = Math.round(22 + (29 - 22) * p);
      cells.push(...spriteToCells(SPRITE_COIN, pileCenterCol - 2, coinRow - 2));
      pileBars = 2;
    } else {
      // Coin #1 has landed: pile becomes at least 3 bars
      pileBars = 3;
      oursEye = "happy";
      if (elapsedMs < 2950 + CANVAS_CONFIG.timings.flashDuration) {
        oursFlash = true;
      }
    }

    // Coin #2: follows 0.35s later (starts at 2850ms)
    if (elapsedMs >= 2850 && elapsedMs < 3200) {
      // Moves left along row 22
      const p = (elapsedMs - 2850) / 350;
      const coinCol = Math.round(otherCenterCol + (pileCenterCol - otherCenterCol) * p);
      cells.push(...spriteToCells(SPRITE_COIN, coinCol - 2, 20));
    } else if (elapsedMs >= 3200 && elapsedMs < 3300) {
      // Drops from row 22 to row 27
      const p = (elapsedMs - 3200) / 100;
      const coinRow = Math.round(22 + (27 - 22) * p);
      cells.push(...spriteToCells(SPRITE_COIN, pileCenterCol - 2, coinRow - 2));
    } else if (elapsedMs >= 3300) {
      // Coin #2 has landed: pile becomes 4 bars
      pileBars = 4;
      oursEye = "happy";
    }
  }

  // 4. Agents & Pile
  cells.push(...getAgentCells(oursTopCol, agentRow, oursEye, oursFlash));
  cells.push(...getAgentCells(otherTopCol, agentRow, "open", false));

  // Pile centered at pileCenterCol
  const pileCells = getPileCells(pileBars);
  for (const pc of pileCells) {
    const colOffset = pc.col - 52;
    cells.push({
      col: pileCenterCol + colOffset,
      row: pc.row,
      state: pc.state,
      scale: pc.scale,
    });
  }

  return { cells };
}

/**
 * Scene 2: PAY (4.5s) Continues directly from Scene 1 end state (pile of 4 bars, Ours returns to
 * OPEN eyes). 0.0-0.5s: Ours bubble with PICTURE icon builds above Ours. 0.5-1.2s: Bubble moves
 * right to painter. 1.2-1.5s: Bubble disappears. 1.5-2.3s: Top bar reassigns into 5x5 coin (pile 3
 * bars), rises to row 22, moves right, merges into painter. Painter FLASHes on arrival. 2.3-3.0s:
 * Painter thinks (dots cycle). 3.0-3.7s: PICTURE icon (no bubble) builds above painter (rows 11-19)
 * and moves left to above Ours. 3.7-4.2s: CHECK MARK builds to right of icon. Ours turns HAPPY &
 * FLASHes. 4.2-4.5s: Hold.
 */
export function getScene2PayFrame(elapsedMs: number, k: number): SceneFrame {
  const cells: Cell[] = [];
  const { agentRow } = CANVAS_CONFIG.positions;
  const oursCenterCol = getCompressedCol(40, k);
  const oursTopCol = oursCenterCol - 4;
  const painterCenterCol = getCompressedCol(88, k);
  const painterTopCol = painterCenterCol - 4;
  const pileCenterCol = getCompressedCol(52, k);

  let oursEye: "open" | "blink" | "happy" = "open";
  let oursFlash = false;
  let painterFlash = false;
  let pileBars = 4;

  // 1. Bubble with Picture Icon (0.0-1.5s)
  if (elapsedMs < 500) {
    // Builds above Ours
    const bubbleCells = getSpeechBubbleCells(oursCenterCol);
    const picIconCells = spriteToCells(SPRITE_PICTURE_ICON, oursCenterCol - 5, 8);
    const combined = [...bubbleCells, ...picIconCells];
    cells.push(...applyBuildEffect(combined, oursCenterCol, agentRow, elapsedMs / 500));
  } else if (elapsedMs < 1200) {
    // Moves right to Painter
    const p = (elapsedMs - 500) / 700;
    const currentCenter = Math.round(oursCenterCol + (painterCenterCol - oursCenterCol) * p);
    cells.push(...getSpeechBubbleCells(currentCenter));
    cells.push(...spriteToCells(SPRITE_PICTURE_ICON, currentCenter - 5, 8));
  } else if (elapsedMs < 1500) {
    // Disappears above Painter
    const bubbleCells = getSpeechBubbleCells(painterCenterCol);
    const picIconCells = spriteToCells(SPRITE_PICTURE_ICON, painterCenterCol - 5, 8);
    const combined = [...bubbleCells, ...picIconCells];
    cells.push(...applyDisappearEffect(combined, (elapsedMs - 1200) / 300, 202));
  }

  // 2. Coin leaving Pile and paying Painter (1.5-2.3s)
  if (elapsedMs >= 1500) {
    pileBars = 3; // Top bar removed

    if (elapsedMs < 1700) {
      // Coin rises from pile (row 27) to row 22
      const p = (elapsedMs - 1500) / 200;
      const coinRow = Math.round(27 + (22 - 27) * p);
      cells.push(...spriteToCells(SPRITE_COIN, pileCenterCol - 2, coinRow - 2));
    } else if (elapsedMs < 2200) {
      // Coin travels along row 22 to painter
      const p = (elapsedMs - 1700) / 500;
      const coinCol = Math.round(pileCenterCol + (painterCenterCol - pileCenterCol) * p);
      cells.push(...spriteToCells(SPRITE_COIN, coinCol - 2, 20));
    } else if (elapsedMs < 2300) {
      // Coin merges into painter
      const p = (elapsedMs - 2200) / 100;
      const scale = Math.max(0, 1.0 - p);
      cells.push(...spriteToCells(SPRITE_COIN, painterCenterCol - 2, 20, "filled", scale));
    }
  }

  // Painter FLASH on arrival at 2.3s
  if (elapsedMs >= 2300 && elapsedMs < 2300 + CANVAS_CONFIG.timings.flashDuration) {
    painterFlash = true;
  }

  // 3. Painter Thinking (2.3-3.0s)
  if (elapsedMs >= 2300 && elapsedMs < 3000) {
    cells.push(...getThinkingDots(painterCenterCol, agentRow, elapsedMs - 2300));
  }

  // 4. Picture Icon Delivery (3.0-3.7s)
  if (elapsedMs >= 3000 && elapsedMs < 3200) {
    // Builds above Painter at rows 11-19
    const picCells = spriteToCells(SPRITE_PICTURE_ICON, painterCenterCol - 5, 11);
    cells.push(...applyBuildEffect(picCells, painterCenterCol, agentRow, (elapsedMs - 3000) / 200));
  } else if (elapsedMs >= 3200 && elapsedMs < 3700) {
    // Moves left at constant speed to above Ours
    const p = (elapsedMs - 3200) / 500;
    const currentCenter = Math.round(painterCenterCol + (oursCenterCol - painterCenterCol) * p);
    cells.push(...spriteToCells(SPRITE_PICTURE_ICON, currentCenter - 5, 11));
  } else if (elapsedMs >= 3700) {
    // Holds above Ours
    cells.push(...spriteToCells(SPRITE_PICTURE_ICON, oursCenterCol - 5, 11));
  }

  // 5. Check Mark & Ours Happy (3.7-4.5s)
  if (elapsedMs >= 3700) {
    const checkStartCol = oursCenterCol + 9;
    const checkTarget = spriteToCells(SPRITE_CHECK_MARK, checkStartCol, 13);

    if (elapsedMs < 3900) {
      // Builds over 3.7-3.9s
      const p = (elapsedMs - 3700) / 200;
      cells.push(...applyBuildEffect(checkTarget, oursCenterCol, agentRow, p));
    } else {
      cells.push(...checkTarget);
    }

    oursEye = "happy";
    if (elapsedMs < 3700 + CANVAS_CONFIG.timings.flashDuration) {
      oursFlash = true;
    }
  }

  // 6. Agents & Pile
  cells.push(...getAgentCells(oursTopCol, agentRow, oursEye, oursFlash));
  cells.push(...getAgentCells(painterTopCol, agentRow, "open", painterFlash));

  const pileCells = getPileCells(pileBars);
  for (const pc of pileCells) {
    const colOffset = pc.col - 52;
    cells.push({
      col: pileCenterCol + colOffset,
      row: pc.row,
      state: pc.state,
      scale: pc.scale,
    });
  }

  return { cells };
}

/** Precomputed deterministic trading transactions for Scene 3 */
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
  const startMs = 2000;
  const endMs = 3400;
  const interval = CANVAS_CONFIG.timings.scene3CoinInterval; // 120ms

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
 * Scene 3: SCALE (4.2s) 0.0-0.8s: Dissolve from Scene 2 into ONE agent centered at (60, 16).
 * 0.8-2.0s: Multiplies in 3 steps: 1 -> 3 -> 9 -> 27 mini agents. 2.0-3.4s: Trading! Mini coins
 * (2x2) fly between adjacent agents; receivers FLASH on arrival. 3.4-4.2s: Dissolve into QNTX
 * wordmark.
 */
export function getScene3ScaleFrame(elapsedMs: number, isMobile: boolean, k: number): SceneFrame {
  const cells: Cell[] = [];
  const numRows = 3;
  const rowCenters = [9, 20, 31];

  // Grid columns
  const standardCols = [16, 28, 40, 52, 64, 76, 88, 100, 112];
  const mobileCols = [16, 40, 64, 88, 112];
  const colCenters = (isMobile ? mobileCols : standardCols).map((c) => getCompressedCol(c, k));
  const numCols = colCenters.length;

  if (elapsedMs < 800) {
    // 0.0-0.8s: Single Agent centered at (60, 16)
    const centerCol = getCompressedCol(64, k);
    cells.push(...getAgentCells(centerCol - 4, 16, "open", false));
    return { cells };
  }

  if (elapsedMs < 1200) {
    // Step 1 (0.8-1.2s): 1 -> 3 mini agents on middle row (row 20)
    const p = (elapsedMs - 800) / 400;
    const midCol = getCompressedCol(64, k);
    const leftTarget = getCompressedCol(52, k);
    const rightTarget = getCompressedCol(76, k);

    // Center agent shrinks to mini
    cells.push(...getMiniAgentCells(midCol - 2, 18));

    // Left and right peel from center
    const leftCol = Math.round(midCol + (leftTarget - midCol) * p);
    const rightCol = Math.round(midCol + (rightTarget - midCol) * p);
    cells.push(...getMiniAgentCells(leftCol - 2, 18));
    cells.push(...getMiniAgentCells(rightCol - 2, 18));

    return { cells };
  }

  if (elapsedMs < 1600) {
    // Step 2 (1.2-1.6s): 3 -> 9 mini agents (3x3 grid)
    const p = (elapsedMs - 1200) / 400;
    const cols3 = [getCompressedCol(40, k), getCompressedCol(64, k), getCompressedCol(88, k)];

    for (const c of cols3) {
      // Middle row
      cells.push(...getMiniAgentCells(c - 2, 18));

      // Top row peels up from 20 to 9
      const topRow = Math.round(20 + (9 - 20) * p);
      cells.push(...getMiniAgentCells(c - 2, topRow - 2));

      // Bottom row peels down from 20 to 31
      const bottomRow = Math.round(20 + (31 - 20) * p);
      cells.push(...getMiniAgentCells(c - 2, bottomRow - 2));
    }

    return { cells };
  }

  if (elapsedMs < 2000) {
    // Step 3 (1.6-2.0s): 9 -> 27 mini agents crowd
    const p = (elapsedMs - 1600) / 400;
    for (let r = 0; r < numRows; r++) {
      const rowCenter = rowCenters[r] ?? 20;
      for (let c = 0; c < numCols; c++) {
        const targetCol = colCenters[c] ?? 64;
        const startCol = getCompressedCol(64, k);
        const currentCol = Math.round(startCol + (targetCol - startCol) * p);
        cells.push(...getMiniAgentCells(currentCol - 2, rowCenter - 2));
      }
    }
    return { cells };
  }

  // 2.0-3.4s: Trading Phase
  const trades = generateTradingSchedule(numCols, numRows);
  const coinDur = CANVAS_CONFIG.timings.scene3CoinDuration; // 280ms
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
      cells.push(...getMiniAgentCells(colCenter - 2, rowCenter - 2, isFlash));
    }
  }

  // Draw active traveling 2x2 mini coins (max 10 in flight)
  let activeCoins = 0;
  for (const trade of trades) {
    const elapsedTrade = elapsedMs - trade.spawnMs;
    if (elapsedTrade >= 0 && elapsedTrade < coinDur) {
      if (activeCoins >= CANVAS_CONFIG.timings.scene3MaxCoins) {
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

/** Static frame for reduced motion mode: Scene 2 at t=2.0s */
export function getReducedMotionPayFrame(k: number): SceneFrame {
  const cells: Cell[] = [];
  const { agentRow } = CANVAS_CONFIG.positions;
  const oursCenterCol = getCompressedCol(40, k);
  const painterCenterCol = getCompressedCol(88, k);
  const pileCenterCol = getCompressedCol(52, k);

  cells.push(...getAgentCells(oursCenterCol - 4, agentRow, "open", false));
  cells.push(...getAgentCells(painterCenterCol - 4, agentRow, "open", false));

  // Pile of 3 bars
  const pileCells = getPileCells(3);
  for (const pc of pileCells) {
    const colOffset = pc.col - 52;
    cells.push({
      col: pileCenterCol + colOffset,
      row: pc.row,
      state: pc.state,
      scale: pc.scale,
    });
  }

  // Coin mid-air at row 22
  const midCoinCol = Math.round((pileCenterCol + painterCenterCol) / 2);
  cells.push(...spriteToCells(SPRITE_COIN, midCoinCol - 2, 20));

  return { cells };
}
