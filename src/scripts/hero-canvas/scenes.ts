/**
 * QuantX Hero Canvas Scene Frame Generator
 *
 * Implements the two-scene narrative: QNTX Wordmark -> Scene 1 (x402 Payment via Piggy-Bank Slot,
 * 8.0s) -> Scene 2 (Crowd Division & High-Frequency Trading, 4.0s) -> QNTX Hold.
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
  getCoinDescendCells,
  getCoinEmergenceCells,
  getCoinSquashCells,
  getCoinUnfoldCells,
  getMiniAgentCells,
  getPaymentBubbleContentCells,
  getSpeechBubbleCells,
  getThinkingDots,
  SPRITE_CHECK_MARK,
  SPRITE_COIN,
  SPRITE_MINI_COIN,
  SPRITE_MONEY_ICON,
  SPRITE_PICTURE_ICON,
  SPRITE_SUCCESS_ICON,
  SPRITE_TASK_ICON,
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
  { name: "PAYMENT_BUBBLE_VANISH", startMs: 4500, endMs: 4700 },
  { name: "A_PAY_SLOT_EMERGE", startMs: 4700, endMs: 4800 },
  { name: "COIN_UNFOLD", startMs: 4800, endMs: 4900 },
  { name: "COIN_TRAVEL_TO_B", startMs: 4900, endMs: 5300 },
  { name: "COIN_SQUASH", startMs: 5300, endMs: 5400 },
  { name: "BAR_DESCEND_INTO_SLOT", startMs: 5400, endMs: 5600 },
  { name: "B_FLASH_AND_THINKING", startMs: 5600, endMs: 6200 },
  { name: "SUCCESS_BUILD", startMs: 6200, endMs: 6500 },
  { name: "SUCCESS_MOVE_TO_A", startMs: 6500, endMs: 7300 },
  { name: "A_HAPPY_HOLD", startMs: 7300, endMs: 8000 },
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
 * Centered QNTX Wordmark Frame (using 84x18 QNTX_SQUARES). On first page load: builds column by
 * column over 0.8s. During hold: letter X flashes twice at t=0.3s (120ms hollow, 120ms filled,
 * 120ms hollow).
 */
export function getQntxFrame(elapsedMs: number, isIntro: boolean, k: number): SceneFrame {
  const cells: Cell[] = [];
  // QNTX wordmark is 84 wide x 18 tall. Centered on stage:
  // startCol = Math.floor((128 - 84) / 2) = 22, startRow = Math.floor((40 - 18) / 2) = 11.
  const baseStartCol = 22;
  const startRow = 11;
  const totalCols = 84;

  // Intro: column-by-column build from left to right over 0.8s
  let maxColAllowed = totalCols;
  if (isIntro) {
    const progress = Math.min(1, elapsedMs / CANVAS_CONFIG.timings.qntxIntroBuild);
    maxColAllowed = Math.floor(progress * totalCols);
  }

  // Double flash on letter X during hold (starting at t=300ms)
  // Letter X starts at local column 66 (columns 66..83)
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
 * Scene 1: x402 PAYMENT (8.0s)
 * Story:
 * 1. Agent A sends Task Icon (from request.svg) in speech bubble to Agent B.
 * 2. Agent B replies with "x402" payment-required bubble carrying Dollar Money Icon (from money.svg).
 * 3. Agent A pays by submitting Dollar Money Icon into Agent B's head slot.
 * 4. Agent B receives, flashes & thinks, then delivers Success Icon (from success.svg) to Agent A.
 * 5. Agent A happily receives Success Icon and flashes.
 */
export function getScene1PaymentFrame(elapsedMs: number, k: number): SceneFrame {
  const cells: Cell[] = [];
  const { agentRow, jumpOnReceive } = CANVAS_CONFIG.positions;
  const centerA = getCompressedCol(40, k);
  const topColA = centerA - 4; // 9 wide -> topCol = center - 4
  const centerB = getCompressedCol(88, k);
  const topColB = centerB - 4;

  let eyeA: "open" | "blink" | "happy" = "open";
  let eyeB: "open" | "blink" | "happy" = "open";
  let flashA = false;
  let flashB = false;
  let jumpA = false;
  let jumpB = false;

  // 1. Request Bubble (A sends Task Icon to B) (0.8s - 2.3s)
  if (elapsedMs >= 800 && elapsedMs < 1100) {
    // 0.8-1.1s: builds above A
    const bubbleCells = getSpeechBubbleCells(centerA);
    const taskCells = spriteToCells(SPRITE_TASK_ICON, centerA - 5, 8);
    const combined = [...bubbleCells, ...taskCells];
    cells.push(...applyBuildEffect(combined, centerA, agentRow, (elapsedMs - 800) / 300));
  } else if (elapsedMs >= 1100 && elapsedMs < 1900) {
    // 1.1-1.9s: moves horizontally right to B (2 cells per tick)
    const p = (elapsedMs - 1100) / 800;
    const currentCenter = Math.round(centerA + (centerB - centerA) * p);
    cells.push(...getSpeechBubbleCells(currentCenter));
    cells.push(...spriteToCells(SPRITE_TASK_ICON, currentCenter - 5, 8));
  } else if (elapsedMs >= 1900 && elapsedMs < 2000) {
    // 1.9-2.0s: arrives above B, B FLASHes
    cells.push(...getSpeechBubbleCells(centerB));
    cells.push(...spriteToCells(SPRITE_TASK_ICON, centerB - 5, 8));
    flashB = true;
  } else if (elapsedMs >= 2000 && elapsedMs < 2300) {
    // 2.0-2.3s: bubble vanishes
    const bubbleCells = getSpeechBubbleCells(centerB);
    const taskCells = spriteToCells(SPRITE_TASK_ICON, centerB - 5, 8);
    const combined = [...bubbleCells, ...taskCells];
    cells.push(...applyVanishEffect(combined, (elapsedMs - 2000) / 300, 101));
    if (elapsedMs < 1900 + CANVAS_CONFIG.timings.flashDuration) {
      flashB = true;
    }
  }

  // 2. Payment-Required Bubble (B answers "x402" with Dollar Money Icon) (2.3s - 4.7s)
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
    // 4.5-4.7s: speech bubble and text vanish completely
    const bubbleCells = getSpeechBubbleCells(centerA);
    const contentCells = getPaymentBubbleContentCells(centerA, 10);
    const vanishing = [...bubbleCells, ...contentCells];
    cells.push(...applyVanishEffect(vanishing, (elapsedMs - 4500) / 200, 202));
  }

  // 3. Dollar Coin Slot Payment & Travel (4.7s - 5.6s)
  if (elapsedMs >= 4700 && elapsedMs < 4800) {
    // 4.7-4.8s: Agent A FLASHes; 1x7 vertical bar emerges from A's slot
    if (elapsedMs < 4700 + CANVAS_CONFIG.timings.flashDuration) {
      flashA = true;
    }
    const p = (elapsedMs - 4700) / 100;
    cells.push(...getCoinEmergenceCells(centerA, agentRow, p));
  } else if (elapsedMs >= 4800 && elapsedMs < 4900) {
    // 4.8-4.9s: bar unfolds into 7x7 pure dollar icon at center col 40, center row 21
    const p = (elapsedMs - 4800) / 100;
    cells.push(...getCoinUnfoldCells(centerA, 21, p));
  } else if (elapsedMs >= 4900 && elapsedMs < 5300) {
    // 4.9-5.3s: pure dollar icon travels right at 4 cells/tick to center col 88, center row 21
    const p = (elapsedMs - 4900) / 400;
    const currentCol = Math.round(centerA + (centerB - centerA) * p);
    cells.push(...spriteToCells(SPRITE_MONEY_ICON, currentCol - 3, 18));
  } else if (elapsedMs >= 5300 && elapsedMs < 5400) {
    // 5.3-5.4s: pure dollar icon squashes into 1x7 vertical bar at col 88, rows 18-24
    const p = (elapsedMs - 5300) / 100;
    cells.push(...getCoinSquashCells(centerB, 21, p));
  } else if (elapsedMs >= 5400 && elapsedMs < 5600) {
    // 5.4-5.6s: bar descends into Agent B's slot
    const p = (elapsedMs - 5400) / 200;
    cells.push(...getCoinDescendCells(centerB, agentRow, p));
  }

  // 4. B Receives, Flashes & Thinks (5.6s - 6.2s)
  if (elapsedMs >= 5600) {
    if (elapsedMs < 5600 + CANVAS_CONFIG.timings.flashDuration) {
      flashB = true;
      if (jumpOnReceive && elapsedMs < 5600 + 66) {
        jumpB = true;
      }
    }
    if (elapsedMs < 6200) {
      // 5.6-6.2s: Agent B thinks (thinking dots above B: rows 22, cols 94, 96, 98)
      cells.push(...getThinkingDots(centerB, agentRow, elapsedMs - 5600));
      // Agent B blinks once at 5.9s
      if (elapsedMs >= 5900 && elapsedMs < 6000) {
        eyeB = "blink";
      }
    }
  }

  // 5. Success Icon Delivery & A Turns Happy (6.2s - 8.0s)
  if (elapsedMs >= 6200 && elapsedMs < 6500) {
    // 6.2-6.5s: success icon builds in place above Agent B
    const successCells = spriteToCells(SPRITE_SUCCESS_ICON, centerB - 5, 11);
    cells.push(...applyBuildEffect(successCells, centerB, agentRow, (elapsedMs - 6200) / 300));
  } else if (elapsedMs >= 6500 && elapsedMs < 7300) {
    // 6.5-7.3s: success icon moves left across to above Agent A (at 2 cells/tick)
    const p = (elapsedMs - 6500) / 800;
    const currentCol = Math.round(centerB + (centerA - centerB) * p);
    cells.push(...spriteToCells(SPRITE_SUCCESS_ICON, currentCol - 5, 11));
  } else if (elapsedMs >= 7300) {
    // 7.3-8.0s: Success icon holds above Agent A; A turns HAPPY and FLASHes
    cells.push(...spriteToCells(SPRITE_SUCCESS_ICON, centerA - 5, 11));
    eyeA = "happy";
    if (elapsedMs < 7300 + CANVAS_CONFIG.timings.flashDuration) {
      flashA = true;
      if (jumpOnReceive && elapsedMs < 7300 + 66) {
        jumpA = true;
      }
    }
  }

  // Agents A and B
  cells.push(...getAgentCells(topColA, agentRow, eyeA, flashA, 1.0, jumpA));
  cells.push(...getAgentCells(topColB, agentRow, eyeB, flashB, 1.0, jumpB));

  return { cells };
}

/** 16 grid coordinates for the crowd in Scene 2, horizontally and vertically centered */
export const CROWD_COORDS: ReadonlyArray<{ readonly col: number; readonly row: number }> =
  [
    { col: 22, row: 7 },
    { col: 50, row: 7 },
    { col: 78, row: 7 },
    { col: 106, row: 7 },
    { col: 22, row: 15 },
    { col: 50, row: 15 },
    { col: 78, row: 15 },
    { col: 106, row: 15 },
    { col: 22, row: 23 },
    { col: 50, row: 23 },
    { col: 78, row: 23 },
    { col: 106, row: 23 },
    { col: 22, row: 31 },
    { col: 50, row: 31 },
    { col: 78, row: 31 },
    { col: 106, row: 31 },
  ];
export const CROWD_COORDS_STAGGERED = CROWD_COORDS;

/** Precomputed deterministic trading transactions for Scene 2 */
type ScheduledTrade = {
  spawnMs: number;
  fromIdx: number;
  toIdx: number;
};

function generateTradingSchedule(seed: number = CANVAS_CONFIG.prngSeed): ScheduledTrade[] {
  const prng = createPRNG(seed);
  const trades: ScheduledTrade[] = [];
  const startMs = 1800;
  const endMs = CANVAS_CONFIG.timings.scene2Duration - CANVAS_CONFIG.timings.scene2DissolveOut;
  const interval = CANVAS_CONFIG.timings.scene2CoinInterval; // 40ms

  for (let t = startMs; t < endMs; t += interval) {
    // Boosted selection for the last row (r = 3: indices 12, 13, 14, 15)
    // 55% of trades involve row 3 (either sent from row 3 or received by row 3)
    const prioritizeLastRow = prng() < 0.55;
    let fromIdx: number;

    if (prioritizeLastRow) {
      const col = Math.floor(prng() * 4);
      // 70% from row 3 agent, 30% from row 2 neighbor trading down into row 3
      fromIdx = prng() < 0.7 ? 12 + col : 8 + col;
    } else {
      fromIdx = Math.floor(prng() * 16);
    }

    const r = Math.floor(fromIdx / 4);
    const c = fromIdx % 4;

    // Pick a valid neighbor in the 4x4 grid
    const neighbors: number[] = [];
    if (c > 0) {
      neighbors.push(r * 4 + (c - 1));
    }
    if (c < 3) {
      neighbors.push(r * 4 + (c + 1));
    }
    if (r > 0) {
      neighbors.push((r - 1) * 4 + c);
    }
    if (r < 3) {
      neighbors.push((r + 1) * 4 + c);
    }

    if (neighbors.length > 0) {
      let toIdx: number;
      if (prioritizeLastRow && r === 2 && neighbors.includes(12 + c)) {
        // Trade directly down into the last row
        toIdx = 12 + c;
      } else if (prioritizeLastRow && r === 3) {
        // Trade either along the last row or upward to row 2
        const neighborIdx = Math.floor(prng() * neighbors.length);
        toIdx = neighbors[neighborIdx] ?? fromIdx;
      } else {
        const neighborIdx = Math.floor(prng() * neighbors.length);
        toIdx = neighbors[neighborIdx] ?? fromIdx;
      }

      trades.push({ spawnMs: t, fromIdx, toIdx });
    }
  }

  return trades;
}

const SCENE_2_TRADES: ScheduledTrade[] = generateTradingSchedule();

/**
 * Scene 2: A CROWD OF AGENTS & TRADING (4.0s) 0.0-0.6s: Starts with a SINGLE 9x9 agent centered on
 * stage (col 60, row 16; center col 64, center row 20). 0.6-1.8s: Seamless mitotic cell division
 * (1 -> 2 -> 4 -> 8 -> 16 mini agents on 4x4 centered grid). Each daughter cell branches cleanly
 * from its parent position without interrupting or resetting. 1.8-3.2s: High-frequency trading!
 * Mini coins fly between neighbors; receiver FLASHes on arrival (with boosted last-row exchange
 * density). 3.2-4.0s: Dissolve into QNTX wordmark.
 */
export function getScene2CrowdFrame(elapsedMs: number, _isMobile: boolean, k: number): SceneFrame {
  const cells: Cell[] = [];
  const crowdCoords = CROWD_COORDS.map((coord) => ({
    col: getCompressedCol(coord.col, k),
    row: coord.row,
  }));

  // 0.0-0.6s: Single 9x9 agent centered on stage (col 60, row 16)
  if (elapsedMs < 600) {
    const centerCol = getCompressedCol(64, k);
    cells.push(...getAgentCells(centerCol - 4, 16, "open", false));
    return { cells };
  }

  // 0.6-1.8s: Cell Division (1 -> 2 -> 4 -> 8 -> 16 mini agents)
  if (elapsedMs < 1800) {
    const divisionElapsed = elapsedMs - 600; // 0..1200ms

    if (divisionElapsed < 300) {
      // Step 1 (0..300ms): 1 -> 2 mini agents horizontally (center row 20, topRow = 17)
      const p = divisionElapsed / 300;
      const isDividingTick = divisionElapsed < 66;
      const midCol = getCompressedCol(64, k);
      const targetLeft = getCompressedCol(50, k);
      const targetRight = getCompressedCol(78, k);

      const curLeft = Math.round(midCol + (targetLeft - midCol) * p);
      const curRight = Math.round(midCol + (targetRight - midCol) * p);

      const scale = isDividingTick ? 0.8 : 1.0;
      cells.push(...getMiniAgentCells(curLeft - 3, 17, false, scale));
      cells.push(...getMiniAgentCells(curRight - 3, 17, false, scale));
      return { cells };
    }

    if (divisionElapsed < 600) {
      // Step 2 (300..600ms): 2 -> 4 mini agents vertically (cols 50 & 78 split from row 20 to rows 15 & 23)
      const p = (divisionElapsed - 300) / 300;
      const isDividingTick = divisionElapsed - 300 < 66;
      const colLeft = getCompressedCol(50, k);
      const colRight = getCompressedCol(78, k);

      const topRow = Math.round(20 + (15 - 20) * p);
      const bottomRow = Math.round(20 + (23 - 20) * p);
      const scale = isDividingTick ? 0.8 : 1.0;

      cells.push(...getMiniAgentCells(colLeft - 3, topRow - 3, false, scale));
      cells.push(...getMiniAgentCells(colRight - 3, topRow - 3, false, scale));
      cells.push(...getMiniAgentCells(colLeft - 3, bottomRow - 3, false, scale));
      cells.push(...getMiniAgentCells(colRight - 3, bottomRow - 3, false, scale));
      return { cells };
    }

    if (divisionElapsed < 900) {
      // Step 3 (600..900ms): 4 -> 8 mini agents horizontally (rows 15 & 23 branch outward to cols 22 & 106)
      const p = (divisionElapsed - 600) / 300;
      const isDividingTick = divisionElapsed - 600 < 66;
      const scale = isDividingTick ? 0.8 : 1.0;

      const col22 = getCompressedCol(22, k);
      const col50 = getCompressedCol(50, k);
      const col78 = getCompressedCol(78, k);
      const col106 = getCompressedCol(106, k);

      const row1 = 15;
      const row2 = 23;

      // Existing 4 agents stay steadily at (50, 15), (78, 15), (50, 23), (78, 23)
      cells.push(...getMiniAgentCells(col50 - 3, row1 - 3, false, scale));
      cells.push(...getMiniAgentCells(col78 - 3, row1 - 3, false, scale));
      cells.push(...getMiniAgentCells(col50 - 3, row2 - 3, false, scale));
      cells.push(...getMiniAgentCells(col78 - 3, row2 - 3, false, scale));

      // 4 daughter agents branch outward towards outer columns 22 and 106
      const curCol22 = Math.round(col50 + (col22 - col50) * p);
      const curCol106 = Math.round(col78 + (col106 - col78) * p);

      cells.push(...getMiniAgentCells(curCol22 - 3, row1 - 3, false, scale));
      cells.push(...getMiniAgentCells(curCol106 - 3, row1 - 3, false, scale));
      cells.push(...getMiniAgentCells(curCol22 - 3, row2 - 3, false, scale));
      cells.push(...getMiniAgentCells(curCol106 - 3, row2 - 3, false, scale));
      return { cells };
    }

    // Step 4 (900..1200ms): 8 -> 16 mini agents vertically
    // Row 15 spawns Row 7 upwards; Row 23 spawns Row 31 (LAST ROW) downwards smoothly
    const p = (divisionElapsed - 900) / 300;
    const isDividingTick = divisionElapsed - 900 < 66;
    const scale = isDividingTick ? 0.8 : 1.0;

    const row0 = 7;
    const row1 = 15;
    const row2 = 23;
    const row3 = 31; // LAST ROW

    const curRow0 = Math.round(row1 + (row0 - row1) * p);
    const curRow3 = Math.round(row2 + (row3 - row2) * p);

    const cols = [
      getCompressedCol(22, k),
      getCompressedCol(50, k),
      getCompressedCol(78, k),
      getCompressedCol(106, k),
    ];

    // The 8 middle agents stay at row 15 and row 23
    for (const c of cols) {
      cells.push(...getMiniAgentCells(c - 3, row1 - 3, false, scale));
      cells.push(...getMiniAgentCells(c - 3, row2 - 3, false, scale));
      // Top row 0 branching smoothly upward from row 15 to row 7
      cells.push(...getMiniAgentCells(c - 3, curRow0 - 3, false, scale));
      // Bottom row 3 (LAST ROW) branching smoothly downward from row 23 to row 31 without interruption
      cells.push(...getMiniAgentCells(c - 3, curRow3 - 3, false, scale));
    }
    return { cells };
  }

  // 1.8s - Dissolve Out: High-Frequency Trading Phase
  const trades = SCENE_2_TRADES;
  const coinDur = CANVAS_CONFIG.timings.scene2CoinDuration; // 240ms
  const flashDur = CANVAS_CONFIG.timings.flashDuration; // 120ms

  // Track which agents are flashing at this timestamp (paying or receiving)
  const flashingAgents = new Set<number>();

  for (const trade of trades) {
    const elapsedTrade = elapsedMs - trade.spawnMs;
    // Paying agent flashes at trade launch (first 120ms)
    if (elapsedTrade >= 0 && elapsedTrade < flashDur) {
      flashingAgents.add(trade.fromIdx);
    }
    // Receiving agent flashes upon arrival (coinDur .. coinDur + flashDur)
    if (elapsedTrade >= coinDur && elapsedTrade < coinDur + flashDur) {
      flashingAgents.add(trade.toIdx);
    }
  }

  // Draw all 16 mini agents
  for (let i = 0; i < 16; i++) {
    const coord = crowdCoords[i];
    if (coord !== undefined) {
      const isFlash = flashingAgents.has(i);
      cells.push(...getMiniAgentCells(coord.col - 3, coord.row - 3, isFlash));
    }
  }

  // Draw active traveling 2x2 mini coins (max 16 in flight)
  let activeCoins = 0;
  for (const trade of trades) {
    const elapsedTrade = elapsedMs - trade.spawnMs;
    if (elapsedTrade >= 0 && elapsedTrade < coinDur) {
      if (activeCoins >= CANVAS_CONFIG.timings.scene2MaxCoins) {
        break;
      }
      activeCoins++;

      const p = elapsedTrade / coinDur;
      const fromCoord = crowdCoords[trade.fromIdx];
      const toCoord = crowdCoords[trade.toIdx];

      if (fromCoord !== undefined && toCoord !== undefined) {
        // Coin travels from sender slot to receiver slot
        const fromX = fromCoord.col;
        const fromY = fromCoord.row - 3;
        const toX = toCoord.col;
        const toY = toCoord.row - 3;

        const coinX = Math.round(fromX + (toX - fromX) * p);
        const coinY = Math.round(fromY + (toY - fromY) * p);

        cells.push(...spriteToCells(SPRITE_MINI_COIN, coinX - 1, coinY - 1));
      }
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

  // Agent A with blink at 3.9s (width 9 -> topCol = center - 4)
  cells.push(...getAgentCells(centerA - 4, agentRow, "blink", false));
  // Agent B open
  cells.push(...getAgentCells(centerB - 4, agentRow, "open", false));

  // Payment-required bubble held still above Agent A
  cells.push(...getSpeechBubbleCells(centerA));
  cells.push(...getPaymentBubbleContentCells(centerA, 10));

  return { cells };
}
