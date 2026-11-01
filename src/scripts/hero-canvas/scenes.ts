/**
 * QuantX Hero Canvas Scene Generator
 *
 * Implements the 3-scene narrative: EARN -> PAY -> SCALE -> QNTX Hold.
 *
 * Strict black & white, ASCII squares matrix, linear whole-cell movement. Symmetrically centered
 * across the wide canvas in all scenes.
 */

import { CANVAS_CONFIG } from "./config";
import { getTextWidth, microTextToCells, textToCells } from "./font";
import {
  createCoinPile,
  createThinkingDots,
  SPRITE_AGENT,
  SPRITE_AGENT_BLINK,
  SPRITE_CHECK_MARK,
  SPRITE_COIN,
  SPRITE_DRAW_ICON,
  SPRITE_MINI_AGENT,
  SPRITE_SPEECH_BUBBLE,
  SPRITE_TRANSLATE_ICON,
  spriteToCells,
} from "./sprites";
import type { SceneFrame, TargetCell } from "./types";

/** Generates 16 symmetrically centered crowd coordinates around (midCol, midRow) */
function getSymmetricalCrowdCoords(
  midCol: number,
  midRow: number,
  isMobile: boolean,
): ReadonlyArray<{ col: number; row: number }> {
  // Column offsets for alternating rows, symmetrical about midCol
  const evenOffsets = isMobile ? [-24, -8, 8, 24] : [-33, -11, 11, 33];
  const oddOffsets = isMobile ? [-18, -4, 4, 18] : [-22, -6, 6, 22];

  // Row offsets, symmetrical about midRow
  const rowOffsets = isMobile ? [-9, -3, 3, 9] : [-12, -4, 4, 12];

  const coords: Array<{ col: number; row: number }> = [];

  for (let r = 0; r < 4; r++) {
    const rowOffset = rowOffsets[r] ?? 0;
    const colOffsets = r % 2 === 0 ? evenOffsets : oddOffsets;
    for (let c = 0; c < 4; c++) {
      const colOffset = colOffsets[c] ?? 0;
      coords.push({
        col: midCol + colOffset - 2,
        row: midRow + rowOffset - 2,
      });
    }
  }

  return coords;
}

/** Symmetrical neighbor pairs for busy market coins in Scene 3 (SCALE) */
const COIN_FLIGHT_PAIRS = [
  { from: 0, to: 4, phase: 0 },
  { from: 3, to: 7, phase: 150 },
  { from: 5, to: 6, phase: 300 },
  { from: 9, to: 10, phase: 450 },
  { from: 12, to: 8, phase: 200 },
  { from: 15, to: 11, phase: 350 },
] as const;

/** QNTX Wordmark Frame (Intro / Outro Hold) */
export function getQntxFrame(
  cols: number,
  rows: number,
  elapsed: number,
  isIntro = false,
): SceneFrame {
  const isMobile = cols < CANVAS_CONFIG.mobile.breakpoint;
  const text = "QNTX";
  const scale = isMobile ? 2 : 3;
  const width = getTextWidth(text, scale, 1);
  const height = 7 * scale;
  const startCol = Math.floor((cols - width) / 2);
  const startRow = Math.floor((rows - height) / 2);

  // Intro: column-by-column light up across the wordmark
  let maxColAllowed = cols;
  if (isIntro) {
    const introProgress = Math.min(1, elapsed / 1000);
    maxColAllowed = startCol + Math.round(width * introProgress);
  }

  // Double flash on letter X during hold (~200ms)
  let xInverted = false;
  if (!isIntro) {
    if ((elapsed >= 400 && elapsed <= 480) || (elapsed >= 540 && elapsed <= 620)) {
      xInverted = true;
    }
  }

  const cells: TargetCell[] = [];

  // Letters Q, N, T
  const qntCells = textToCells("QNT", startCol, startRow, scale, "filled", 1);
  for (const c of qntCells) {
    if (c.col <= maxColAllowed) {
      cells.push(c);
    }
  }

  // Letter X with possible invert flash
  const xCol = startCol + getTextWidth("QNT", scale, 1) + scale;
  const xCells = textToCells("X", xCol, startRow, scale, xInverted ? "inverted" : "filled", 1);
  for (const c of xCells) {
    if (c.col <= maxColAllowed) {
      cells.push(c);
    }
  }

  return { cells };
}

/** SCENE 1: EARN (4s) - Two agents bookending the canvas symmetrically */
export function getScene1EarnFrame(cols: number, rows: number, elapsed: number): SceneFrame {
  const cells: TargetCell[] = [];
  const isMobile = cols < CANVAS_CONFIG.mobile.breakpoint;

  const midCol = Math.floor(cols / 2);
  const midRow = Math.floor(rows / 2);
  const agentRow = midRow - 4;

  // Space agents widely and symmetrically to balance the wide canvas
  const spacing = isMobile ? 20 : 30;
  const leftCol = midCol - spacing - 3;
  const rightCol = midCol + spacing - 3;
  const pileCol = leftCol + 8;
  const pileRow = agentRow + 2;

  // 1. Right Agent (Client) - Stays visible throughout to maintain balance
  cells.push(...spriteToCells(SPRITE_AGENT, rightCol, agentRow, "filled", 1.0));

  // 2. Speech bubble travels from right agent to the EXACT CENTER between them
  const targetBubbleCol = midCol - 5;
  const bubbleRow = agentRow - 8;
  const bubbleCol =
    elapsed < 1200
      ? Math.round(rightCol - 12 - (rightCol - 12 - targetBubbleCol) * (elapsed / 1200))
      : targetBubbleCol;

  cells.push(...spriteToCells(SPRITE_SPEECH_BUBBLE, bubbleCol, bubbleRow, "filled", 1.0));
  cells.push(...spriteToCells(SPRITE_TRANSLATE_ICON, bubbleCol + 2, bubbleRow + 2, "filled", 1.0));
  cells.push(...microTextToCells("TRANSLATE", bubbleCol - 7, bubbleRow + 9, 1, "filled", 1));

  // 3. Left Agent (Earner): Blinks at 2000ms - 2200ms
  const isBlinking = elapsed >= 2000 && elapsed <= 2200;
  const leftAgentSprite = isBlinking ? SPRITE_AGENT_BLINK : SPRITE_AGENT;
  cells.push(...spriteToCells(leftAgentSprite, leftCol, agentRow, "filled", 1.0));

  // Thinking dots: 1200ms - 2400ms above left agent
  if (elapsed >= 1200 && elapsed < 2400) {
    let dotCount = 1;
    if (elapsed >= 1600 && elapsed < 2000) {
      dotCount = 2;
    } else if (elapsed >= 2000) {
      dotCount = 3;
    }
    cells.push(...createThinkingDots(leftCol, agentRow, dotCount));
  }

  // 4. Coin flight from Right Agent to Left Agent Coin Pile (2400ms - 3500ms)
  let coinPileCount = 2;
  if (elapsed >= 2400 && elapsed < 3500) {
    const travelT = (elapsed - 2400) / 1100;
    const coinCol = Math.round(rightCol - 6 - (rightCol - 6 - (pileCol + 4)) * travelT);
    const coinRow = Math.round(agentRow + 1 + (pileRow - 4 - (agentRow + 1)) * travelT);
    cells.push(...spriteToCells(SPRITE_COIN, coinCol, coinRow, "filled", 1.0));
  } else if (elapsed >= 3500) {
    coinPileCount = 3;
  }

  // Coin pile at left agent's feet
  cells.push(...createCoinPile(pileCol, pileRow, coinPileCount));

  return { cells };
}

/** SCENE 2: PAY (4.5s) - Symmetrically balanced with result centered */
export function getScene2PayFrame(cols: number, rows: number, elapsed: number): SceneFrame {
  const cells: TargetCell[] = [];
  const isMobile = cols < CANVAS_CONFIG.mobile.breakpoint;

  const midCol = Math.floor(cols / 2);
  const midRow = Math.floor(rows / 2);
  const agentRow = midRow - 4;

  const spacing = isMobile ? 20 : 30;
  const leftCol = midCol - spacing - 3;
  const rightCol = midCol + spacing - 3;
  const pileCol = leftCol + 8;
  const pileRow = agentRow + 2;

  // Left Agent (Spender) & Right Agent (Painter)
  cells.push(...spriteToCells(SPRITE_AGENT, leftCol, agentRow, "filled", 1.0));

  const painterBlink = elapsed >= 1900 && elapsed <= 2100;
  const painterSprite = painterBlink ? SPRITE_AGENT_BLINK : SPRITE_AGENT;
  cells.push(...spriteToCells(painterSprite, rightCol, agentRow, "filled", 1.0));

  // Coin pile: starts with 3, shrinks to 2 after payment
  let pileCount = 3;

  // Sub-step 1: Coin flies from Left Agent to Right Agent (800ms - 1900ms)
  if (elapsed >= 800 && elapsed < 1900) {
    pileCount = 2;
    const t = (elapsed - 800) / 1100;
    const coinCol = Math.round(pileCol + 4 + (rightCol - 6 - (pileCol + 4)) * t);
    const coinRow = Math.round(pileRow - 4 + (agentRow + 1 - (pileRow - 4)) * t);
    cells.push(...spriteToCells(SPRITE_COIN, coinCol, coinRow, "filled", 1.0));

    if (CANVAS_CONFIG.SHOW_X402_LABEL) {
      cells.push(...microTextToCells("X402", coinCol - 1, coinRow + 6, 1, "filled", 1));
    }
  } else if (elapsed >= 1900) {
    pileCount = 2;
  }

  cells.push(...createCoinPile(pileCol, pileRow, pileCount));

  // Sub-step 2: Right agent sends back picture sprite to the CENTER (2100ms - 3200ms)
  const targetPicCol = midCol - 4;
  const targetPicRow = agentRow - 7;

  if (elapsed >= 2100 && elapsed < 3200) {
    const t = (elapsed - 2100) / 1100;
    const picCol = Math.round(rightCol - 7 - (rightCol - 7 - targetPicCol) * t);
    const picRow = Math.round(agentRow + 1 + (targetPicRow - (agentRow + 1)) * t);
    cells.push(...spriteToCells(SPRITE_DRAW_ICON, picCol, picRow, "filled", 1.0));
  }
  // Sub-step 3: Picture lands in the center between them with check mark ✓ (3200ms - 4500ms)
  else if (elapsed >= 3200) {
    const picState = elapsed >= 3500 && elapsed <= 3700 ? "inverted" : "filled";
    cells.push(...spriteToCells(SPRITE_DRAW_ICON, targetPicCol, targetPicRow, picState, 1.0));
    cells.push(
      ...spriteToCells(SPRITE_CHECK_MARK, targetPicCol + 9, targetPicRow + 1, "filled", 1.0),
    );
  }

  return { cells };
}

/** SCENE 3: SCALE (4s) - Symmetrically expands from canvas center */
export function getScene3ScaleFrame(cols: number, rows: number, elapsed: number): SceneFrame {
  const cells: TargetCell[] = [];
  const isMobile = cols < CANVAS_CONFIG.mobile.breakpoint;

  const midCol = Math.floor(cols / 2);
  const midRow = Math.floor(rows / 2);

  const crowdCoords = getSymmetricalCrowdCoords(midCol, midRow, isMobile);

  // Sub-step 1 & 2: Center doubling 1 -> 2 -> 4 -> 8 -> 16 outwards (0ms - 3100ms)
  if (elapsed < 3100) {
    // Symmetrical doubling subsets
    if (elapsed < 400) {
      // 1 mini agent at the exact center
      cells.push(...spriteToCells(SPRITE_MINI_AGENT, midCol - 2, midRow - 2, "filled", 1.0));
    } else if (elapsed < 800) {
      // 2 mini agents symmetrical around center
      const offset = isMobile ? 14 : 20;
      cells.push(
        ...spriteToCells(SPRITE_MINI_AGENT, midCol - offset - 2, midRow - 2, "filled", 1.0),
      );
      cells.push(
        ...spriteToCells(SPRITE_MINI_AGENT, midCol + offset - 2, midRow - 2, "filled", 1.0),
      );
    } else if (elapsed < 1200) {
      // 4 mini agents in a centered 2x2 grid
      const offX = isMobile ? 16 : 22;
      const offY = isMobile ? 5 : 7;
      cells.push(
        ...spriteToCells(SPRITE_MINI_AGENT, midCol - offX - 2, midRow - offY - 2, "filled", 1.0),
      );
      cells.push(
        ...spriteToCells(SPRITE_MINI_AGENT, midCol + offX - 2, midRow - offY - 2, "filled", 1.0),
      );
      cells.push(
        ...spriteToCells(SPRITE_MINI_AGENT, midCol - offX - 2, midRow + offY - 2, "filled", 1.0),
      );
      cells.push(
        ...spriteToCells(SPRITE_MINI_AGENT, midCol + offX - 2, midRow + offY - 2, "filled", 1.0),
      );
    } else if (elapsed < 1600) {
      // 8 mini agents symmetrically positioned
      const indices = [1, 2, 4, 7, 8, 11, 13, 14];
      for (const idx of indices) {
        const pos = crowdCoords[idx];
        if (pos !== undefined) {
          cells.push(...spriteToCells(SPRITE_MINI_AGENT, pos.col, pos.row, "filled", 1.0));
        }
      }
    } else {
      // All 16 mini agents active
      for (const pos of crowdCoords) {
        cells.push(...spriteToCells(SPRITE_MINI_AGENT, pos.col, pos.row, "filled", 1.0));
      }
    }

    // Busy market coins in flight between symmetrical neighbors (1600ms - 3100ms)
    if (elapsed >= 1600) {
      const marketElapsed = elapsed - 1600;
      for (const flight of COIN_FLIGHT_PAIRS) {
        const routeDuration = 600;
        const flightTime = (marketElapsed + flight.phase) % routeDuration;
        const t = flightTime / routeDuration;

        const fromPos = crowdCoords[flight.from];
        const toPos = crowdCoords[flight.to];
        if (fromPos !== undefined && toPos !== undefined) {
          const coinCol = Math.round(fromPos.col + (toPos.col - fromPos.col) * t);
          const coinRow = Math.round(fromPos.row + (toPos.row - fromPos.row) * t);
          cells.push(...spriteToCells(SPRITE_COIN, coinCol, coinRow, "filled", 1.0));
        }
      }
    }

    return { cells };
  }

  // Sub-step 3: All agents and coins flow straight into the QNTX wordmark (3100ms - 4000ms)
  const qntxFrame = getQntxFrame(cols, rows, elapsed - 3100, false);
  const qntxTargets = qntxFrame.cells;

  if (elapsed < 3800) {
    const t = (elapsed - 3100) / 700;
    const targetLen = qntxTargets.length;
    for (let i = 0; i < targetLen; i++) {
      const target = qntxTargets[i];
      const crowdPos = crowdCoords[i % crowdCoords.length];
      if (target !== undefined && crowdPos !== undefined) {
        cells.push({
          col: Math.round(crowdPos.col + (target.col - crowdPos.col) * t),
          row: Math.round(crowdPos.row + (target.row - crowdPos.row) * t),
          state: target.state ?? "filled",
          scale: 1.0,
        });
      }
    }
    return { cells };
  }

  // 3800ms - 4000ms: QNTX wordmark fully assembled, letter X double flash
  return qntxFrame;
}

/** End state of PAY (used for prefers-reduced-motion) - Centered balance */
export function getReducedMotionPayFrame(cols: number, rows: number): SceneFrame {
  const cells: TargetCell[] = [];
  const isMobile = cols < CANVAS_CONFIG.mobile.breakpoint;

  const midCol = Math.floor(cols / 2);
  const midRow = Math.floor(rows / 2);
  const agentRow = midRow - 4;

  const spacing = isMobile ? 20 : 30;
  const leftCol = midCol - spacing - 3;
  const rightCol = midCol + spacing - 3;
  const pileCol = leftCol + 8;
  const pileRow = agentRow + 2;

  // Left agent with 2 coins
  cells.push(...spriteToCells(SPRITE_AGENT, leftCol, agentRow, "filled", 1.0));
  cells.push(...createCoinPile(pileCol, pileRow, 2));

  // Right agent (painter)
  cells.push(...spriteToCells(SPRITE_AGENT, rightCol, agentRow, "filled", 1.0));

  // Picture and check mark centered between the two agents
  const targetPicCol = midCol - 4;
  const targetPicRow = agentRow - 7;
  cells.push(...spriteToCells(SPRITE_DRAW_ICON, targetPicCol, targetPicRow, "filled", 1.0));
  cells.push(
    ...spriteToCells(SPRITE_CHECK_MARK, targetPicCol + 9, targetPicRow + 1, "filled", 1.0),
  );

  return { cells };
}
