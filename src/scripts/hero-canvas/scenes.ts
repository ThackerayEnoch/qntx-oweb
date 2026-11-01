/**
 * QuantX Hero Canvas Scene Generator
 *
 * Implements the 3-scene narrative: EARN -> PAY -> SCALE -> QuantX Hold.
 *
 * Strict black & white, ASCII squares matrix, linear whole-cell movement. Symmetrically centered
 * with wide spacing across the canvas in all scenes.
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

/** Generates 16 widely and symmetrically spaced crowd coordinates around (midCol, midRow) */
function getSymmetricalCrowdCoords(
  midCol: number,
  midRow: number,
  isMobile: boolean,
): ReadonlyArray<{ col: number; row: number }> {
  // Column offsets for alternating rows, stretched wide to fill canvas
  const evenOffsets = isMobile ? [-27, -9, 9, 27] : [-42, -14, 14, 42];
  const oddOffsets = isMobile ? [-18, -6, 6, 18] : [-28, -9, 9, 28];

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

/** QuantX Wordmark Frame (Intro / Outro Hold) */
export function getQntxFrame(
  cols: number,
  rows: number,
  elapsed: number,
  isIntro = false,
): SceneFrame {
  const isMobile = cols < CANVAS_CONFIG.mobile.breakpoint;
  const text = "QuantX";
  const scale = isMobile ? 1 : 2;
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

  // Letters Q, u, a, n, t
  const quantCells = textToCells("Quant", startCol, startRow, scale, "filled", 1);
  for (const c of quantCells) {
    if (c.col <= maxColAllowed) {
      cells.push(c);
    }
  }

  // Letter X with possible invert flash
  const xCol = startCol + getTextWidth("Quant", scale, 1) + scale;
  const xCells = textToCells("X", xCol, startRow, scale, xInverted ? "inverted" : "filled", 1);
  for (const c of xCells) {
    if (c.col <= maxColAllowed) {
      cells.push(c);
    }
  }

  return { cells };
}

/** SCENE 1: EARN (4s) - Two agents widely spaced across the wide canvas */
export function getScene1EarnFrame(cols: number, rows: number, elapsed: number): SceneFrame {
  const cells: TargetCell[] = [];
  const isMobile = cols < CANVAS_CONFIG.mobile.breakpoint;

  const midCol = Math.floor(cols / 2);
  const midRow = Math.floor(rows / 2);
  const agentRow = midRow - 4;

  // Space agents near the outer canvas margins
  const leftCol = isMobile ? 2 : 4;
  const rightCol = isMobile ? cols - 9 : cols - 11;
  const pileCol = leftCol + 8;
  const pileRow = agentRow + 2;

  // 1. Right Agent (Client) - Stays visible throughout to keep perfect balance
  cells.push(...spriteToCells(SPRITE_AGENT, rightCol, agentRow, "filled", 1.0));

  // 2. Speech bubble travels from right agent to the EXACT CENTER between them
  const targetBubbleCol = midCol - 5;
  const bubbleRow = agentRow - 8;
  const bubbleCol =
    elapsed < 1200
      ? Math.round(rightCol - 12 - (rightCol - 12 - targetBubbleCol) * (elapsed / 1200))
      : targetBubbleCol;

  // Fade out speech bubble when transaction completes (3500ms - 4000ms)
  const bubbleScale = elapsed >= 3500 ? Math.max(0, 1 - (elapsed - 3500) / 400) : 1.0;
  if (bubbleScale > 0.05) {
    cells.push(...spriteToCells(SPRITE_SPEECH_BUBBLE, bubbleCol, bubbleRow, "filled", bubbleScale));
    cells.push(
      ...spriteToCells(SPRITE_TRANSLATE_ICON, bubbleCol + 2, bubbleRow + 2, "filled", bubbleScale),
    );
    cells.push(
      ...microTextToCells("TRANSLATE", bubbleCol - 7, bubbleRow + 9, 1, "filled", 1).map((c) => ({
        ...c,
        scale: bubbleScale,
      })),
    );
  }

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

/** SCENE 2: PAY (4.5s) - Widely spaced with result centered in the middle */
export function getScene2PayFrame(cols: number, rows: number, elapsed: number): SceneFrame {
  const cells: TargetCell[] = [];
  const isMobile = cols < CANVAS_CONFIG.mobile.breakpoint;

  const midCol = Math.floor(cols / 2);
  const midRow = Math.floor(rows / 2);
  const agentRow = midRow - 4;

  const leftCol = isMobile ? 2 : 4;
  const rightCol = isMobile ? cols - 9 : cols - 11;
  const pileCol = leftCol + 8;
  const pileRow = agentRow + 2;

  // Left Agent (Spender) & Right Agent (Painter)
  cells.push(...spriteToCells(SPRITE_AGENT, leftCol, agentRow, "filled", 1.0));

  const painterBlink = elapsed >= 2300 && elapsed <= 2500;
  const painterSprite = painterBlink ? SPRITE_AGENT_BLINK : SPRITE_AGENT;
  cells.push(...spriteToCells(painterSprite, rightCol, agentRow, "filled", 1.0));

  // Request Bubble with DRAW icon above Left Agent (0ms - 1600ms, fades out as coin leaves)
  const reqBubbleCol = leftCol - 2;
  const reqBubbleRow = agentRow - 8;
  const reqScale = elapsed < 1200 ? 1.0 : Math.max(0, 1 - (elapsed - 1200) / 400);
  if (reqScale > 0.05) {
    cells.push(
      ...spriteToCells(SPRITE_SPEECH_BUBBLE, reqBubbleCol, reqBubbleRow, "filled", reqScale),
    );
    cells.push(
      ...spriteToCells(SPRITE_DRAW_ICON, reqBubbleCol + 2, reqBubbleRow + 1, "filled", reqScale),
    );
    cells.push(
      ...microTextToCells("DRAW", reqBubbleCol + 2, reqBubbleRow + 9, 1, "filled", 1).map((c) => ({
        ...c,
        scale: reqScale,
      })),
    );
  }

  // Coin pile: starts with 3, shrinks to 2 after payment is sent (1200ms)
  let pileCount = 3;

  // Sub-step 1: Coin flies from Left Agent across the wide span to Right Agent (1200ms - 2300ms)
  if (elapsed >= 1200 && elapsed < 2300) {
    pileCount = 2;
    const t = (elapsed - 1200) / 1100;
    const coinCol = Math.round(pileCol + 4 + (rightCol - 6 - (pileCol + 4)) * t);
    const coinRow = Math.round(pileRow - 4 + (agentRow + 1 - (pileRow - 4)) * t);
    cells.push(...spriteToCells(SPRITE_COIN, coinCol, coinRow, "filled", 1.0));

    if (CANVAS_CONFIG.SHOW_X402_LABEL) {
      cells.push(...microTextToCells("X402", coinCol - 1, coinRow + 6, 1, "filled", 1));
    }
  } else if (elapsed >= 2300) {
    pileCount = 2;
  }

  cells.push(...createCoinPile(pileCol, pileRow, pileCount));

  // Sub-step 2: Right agent sends back picture sprite to the CENTER (2500ms - 3500ms)
  // Centered 14-col unit (7w drawing + 2 gap + 5w checkmark) at midCol
  const targetPicCol = midCol - 7;
  const targetPicRow = agentRow - 7;

  if (elapsed >= 2500 && elapsed < 3500) {
    const t = (elapsed - 2500) / 1000;
    const picCol = Math.round(rightCol - 7 - (rightCol - 7 - targetPicCol) * t);
    const picRow = Math.round(agentRow + 1 + (targetPicRow - (agentRow + 1)) * t);
    cells.push(...spriteToCells(SPRITE_DRAW_ICON, picCol, picRow, "filled", 1.0));
  }
  // Sub-step 3: Picture lands in the center between them with check mark ✓ (3500ms - 4500ms)
  else if (elapsed >= 3500) {
    const picState = elapsed >= 3700 && elapsed <= 3900 ? "inverted" : "filled";
    cells.push(...spriteToCells(SPRITE_DRAW_ICON, targetPicCol, targetPicRow, picState, 1.0));
    cells.push(
      ...spriteToCells(SPRITE_CHECK_MARK, targetPicCol + 9, targetPicRow + 1, "filled", 1.0),
    );
  }

  return { cells };
}

/** SCENE 3: SCALE (4s) - Widely expands from canvas center across full width */
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
      // 2 mini agents widely spaced symmetrical around center
      const offset = isMobile ? 22 : 38;
      cells.push(
        ...spriteToCells(SPRITE_MINI_AGENT, midCol - offset - 2, midRow - 2, "filled", 1.0),
      );
      cells.push(
        ...spriteToCells(SPRITE_MINI_AGENT, midCol + offset - 2, midRow - 2, "filled", 1.0),
      );
    } else if (elapsed < 1200) {
      // 4 mini agents in a widely spaced centered 2x2 grid
      const offX = isMobile ? 24 : 38;
      const offY = isMobile ? 6 : 8;
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
      // 8 mini agents widely positioned
      const indices = [0, 3, 5, 6, 9, 10, 12, 15];
      for (const idx of indices) {
        const pos = crowdCoords[idx];
        if (pos !== undefined) {
          cells.push(...spriteToCells(SPRITE_MINI_AGENT, pos.col, pos.row, "filled", 1.0));
        }
      }
    } else {
      // All 16 mini agents active across wide grid
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

  // Sub-step 3: All agents and coins flow straight into the QuantX wordmark (3100ms - 4000ms)
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

  // 3800ms - 4000ms: QuantX wordmark fully assembled, letter X double flash
  return qntxFrame;
}

/** End state of PAY (used for prefers-reduced-motion) - Wide centered balance */
export function getReducedMotionPayFrame(cols: number, rows: number): SceneFrame {
  const cells: TargetCell[] = [];
  const isMobile = cols < CANVAS_CONFIG.mobile.breakpoint;

  const midCol = Math.floor(cols / 2);
  const midRow = Math.floor(rows / 2);
  const agentRow = midRow - 4;

  const leftCol = isMobile ? 2 : 4;
  const rightCol = isMobile ? cols - 9 : cols - 11;
  const pileCol = leftCol + 8;
  const pileRow = agentRow + 2;

  // Left agent with 2 coins
  cells.push(...spriteToCells(SPRITE_AGENT, leftCol, agentRow, "filled", 1.0));
  cells.push(...createCoinPile(pileCol, pileRow, 2));

  // Right agent (painter)
  cells.push(...spriteToCells(SPRITE_AGENT, rightCol, agentRow, "filled", 1.0));

  // Picture and check mark centered between the two agents
  const targetPicCol = midCol - 7;
  const targetPicRow = agentRow - 7;
  cells.push(...spriteToCells(SPRITE_DRAW_ICON, targetPicCol, targetPicRow, "filled", 1.0));
  cells.push(
    ...spriteToCells(SPRITE_CHECK_MARK, targetPicCol + 9, targetPicRow + 1, "filled", 1.0),
  );

  return { cells };
}
