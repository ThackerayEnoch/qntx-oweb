/**
 * QuantX Hero Canvas Scene Generator
 *
 * Implements the 3-scene narrative: EARN -> PAY -> SCALE -> QNTX Hold.
 *
 * Strict black & white, ASCII squares matrix, linear whole-cell movement. All scenes are
 * mathematically horizontally centered across the canvas.
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

/** 6 neighbor pairs for busy market coins in Scene 3 (SCALE) */
const COIN_FLIGHT_PAIRS = [
  { from: 0, to: 4, phase: 0 },
  { from: 3, to: 7, phase: 150 },
  { from: 5, to: 6, phase: 300 },
  { from: 12, to: 8, phase: 450 },
  { from: 15, to: 11, phase: 200 },
  { from: 9, to: 10, phase: 350 },
] as const;

/** Computes 16 staggered coordinates mathematically centered across the canvas */
function getCrowdCoords(cols: number, rows: number): TargetCell[] {
  const midCol = Math.floor(cols / 2);
  const midRow = Math.floor(rows / 2);
  const isMobile = cols < CANVAS_CONFIG.mobile.breakpoint;

  const rowY = isMobile
    ? [midRow - 12, midRow - 4, midRow + 4, midRow + 12]
    : [midRow - 14, midRow - 5, midRow + 4, midRow + 13];

  const outerOffset = isMobile ? 24 : 38;
  const innerOffset = isMobile ? 8 : 14;
  const stagOuter = isMobile ? 16 : 26;
  const stagInner = isMobile ? 1 : 6;

  // Row 0 (4 agents, wide)
  const r0 = [
    { col: midCol - outerOffset, row: rowY[0] ?? midRow - 14 },
    { col: midCol - innerOffset, row: rowY[0] ?? midRow - 14 },
    { col: midCol + innerOffset - 5, row: rowY[0] ?? midRow - 14 },
    { col: midCol + outerOffset - 5, row: rowY[0] ?? midRow - 14 },
  ];
  // Row 1 (4 agents, staggered)
  const r1 = [
    { col: midCol - stagOuter, row: rowY[1] ?? midRow - 5 },
    { col: midCol - stagInner - 2, row: rowY[1] ?? midRow - 5 },
    { col: midCol + stagInner - 3, row: rowY[1] ?? midRow - 5 },
    { col: midCol + stagOuter - 5, row: rowY[1] ?? midRow - 5 },
  ];
  // Row 2 (4 agents, wide)
  const r2 = [
    { col: midCol - outerOffset, row: rowY[2] ?? midRow + 4 },
    { col: midCol - innerOffset, row: rowY[2] ?? midRow + 4 },
    { col: midCol + innerOffset - 5, row: rowY[2] ?? midRow + 4 },
    { col: midCol + outerOffset - 5, row: rowY[2] ?? midRow + 4 },
  ];
  // Row 3 (4 agents, staggered)
  const r3 = [
    { col: midCol - stagOuter, row: rowY[3] ?? midRow + 13 },
    { col: midCol - stagInner - 2, row: rowY[3] ?? midRow + 13 },
    { col: midCol + stagInner - 3, row: rowY[3] ?? midRow + 13 },
    { col: midCol + stagOuter - 5, row: rowY[3] ?? midRow + 13 },
  ];

  return [...r0, ...r1, ...r2, ...r3];
}

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

/** SCENE 1: EARN (4s) */
export function getScene1EarnFrame(cols: number, rows: number, elapsed: number): SceneFrame {
  const cells: TargetCell[] = [];
  const isMobile = cols < CANVAS_CONFIG.mobile.breakpoint;

  const midCol = Math.floor(cols / 2);
  const agentRow = Math.floor(rows / 2) - 4;

  // Pull the two AIs widely apart across the broad canvas with identical margins on both sides
  const leftCol = isMobile ? 4 : 6;
  const rightCol = isMobile ? cols - 11 : cols - 13;
  const pileCol = leftCol + 8;
  const pileRow = agentRow + 2;

  // 1. Speech bubble with TRANSLATE icon traveling from right agent to center of canvas
  const bubbleRow = agentRow - 7;
  const bubbleCol =
    elapsed < 1200
      ? Math.round(rightCol - 12 - (rightCol - 12 - (midCol - 5)) * (elapsed / 1200))
      : midCol - 5;

  // Fade out speech bubble at the end of Scene 1 (3500ms - 4000ms)
  let bubbleScale = 1.0;
  if (elapsed >= 3500) {
    const fadeT = Math.min(1, (elapsed - 3500) / 400);
    bubbleScale = Math.max(0, 1 - fadeT);
  }

  // Right Agent (Client) stays symmetrically in place
  cells.push(...spriteToCells(SPRITE_AGENT, rightCol, agentRow, "filled", 1.0));

  if (bubbleScale > 0.05) {
    // Speech bubble situated in the horizontal center
    cells.push(...spriteToCells(SPRITE_SPEECH_BUBBLE, bubbleCol, bubbleRow, "filled", bubbleScale));
    // TRANSLATE icon inside bubble
    cells.push(
      ...spriteToCells(SPRITE_TRANSLATE_ICON, bubbleCol + 2, bubbleRow + 2, "filled", bubbleScale),
    );
    // Micro caption "TRANSLATE" centered under bubble
    cells.push(
      ...microTextToCells("TRANSLATE", midCol - 17, bubbleRow + 9, 1, "filled", 1).map((c) => ({
        ...c,
        scale: bubbleScale,
      })),
    );
  }

  // 2. Left Agent (Earner): Blinks at 2000ms - 2200ms
  const isBlinking = elapsed >= 2000 && elapsed <= 2200;
  const leftAgentSprite = isBlinking ? SPRITE_AGENT_BLINK : SPRITE_AGENT;
  cells.push(...spriteToCells(leftAgentSprite, leftCol, agentRow, "filled", 1.0));

  // Thinking dots: 1200ms - 2400ms (light up 1 by 1 above left agent)
  if (elapsed >= 1200 && elapsed < 2400) {
    let dotCount = 1;
    if (elapsed >= 1600 && elapsed < 2000) {
      dotCount = 2;
    } else if (elapsed >= 2000) {
      dotCount = 3;
    }
    cells.push(...createThinkingDots(leftCol, agentRow, dotCount));
  }

  // 3. Coin flight across the wide canvas from Right Agent to Left Agent Coin Pile (2400ms - 3500ms)
  let coinPileCount = 2;
  if (elapsed >= 2400 && elapsed < 3500) {
    const travelT = (elapsed - 2400) / 1100;
    const coinCol = Math.round(rightCol - 6 - (rightCol - 6 - (pileCol + 4)) * travelT);
    const coinRow = Math.round(agentRow + 1 + (pileRow - 4 - (agentRow + 1)) * travelT);
    cells.push(...spriteToCells(SPRITE_COIN, coinCol, coinRow, "filled", 1.0));
  } else if (elapsed >= 3500) {
    // Coin landed on pile -> pile grows from 2 to 3 coins!
    coinPileCount = 3;
  }

  // Coin pile at left agent's feet
  cells.push(...createCoinPile(pileCol, pileRow, coinPileCount));

  return { cells };
}

/** SCENE 2: PAY (4.5s) */
export function getScene2PayFrame(cols: number, rows: number, elapsed: number): SceneFrame {
  const cells: TargetCell[] = [];
  const isMobile = cols < CANVAS_CONFIG.mobile.breakpoint;

  const midCol = Math.floor(cols / 2);
  const agentRow = Math.floor(rows / 2) - 4;

  // Same wide, symmetrical horizontal positioning as Scene 1
  const leftCol = isMobile ? 4 : 6;
  const rightCol = isMobile ? cols - 11 : cols - 13;
  const pileCol = leftCol + 8;
  const pileRow = agentRow + 2;

  // Left Agent (Spender)
  cells.push(...spriteToCells(SPRITE_AGENT, leftCol, agentRow, "filled", 1.0));

  // Painter Agent on the right: blinks after receiving coin (2000ms - 2200ms)
  const painterBlink = elapsed >= 2000 && elapsed <= 2200;
  const painterSprite = painterBlink ? SPRITE_AGENT_BLINK : SPRITE_AGENT;
  cells.push(...spriteToCells(painterSprite, rightCol, agentRow, "filled", 1.0));

  // Coin pile starts with 3, shrinks to 2 after left agent spends one coin
  let pileCount = 3;

  // Sub-step 1: Coin flies across wide canvas from Left pile to Right Agent (800ms - 2000ms)
  if (elapsed >= 800 && elapsed < 2000) {
    pileCount = 2;
    const t = (elapsed - 800) / 1200;
    const coinCol = Math.round(pileCol + 4 + (rightCol - 6 - (pileCol + 4)) * t);
    const coinRow = Math.round(pileRow - 4 + (agentRow + 1 - (pileRow - 4)) * t);
    cells.push(...spriteToCells(SPRITE_COIN, coinCol, coinRow, "filled", 1.0));

    // Optional micro caption "X402" traveling under coin
    if (CANVAS_CONFIG.SHOW_X402_LABEL) {
      cells.push(...microTextToCells("X402", coinCol - 1, coinRow + 6, 1, "filled", 1));
    }
  } else if (elapsed >= 2000) {
    pileCount = 2;
  }

  cells.push(...createCoinPile(pileCol, pileRow, pileCount));

  // Sub-step 2: Right agent sends back picture sprite to the center of the canvas (2200ms - 3200ms)
  if (elapsed >= 2200 && elapsed < 3200) {
    const t = (elapsed - 2200) / 1000;
    const picCol = Math.round(rightCol - 7 - (rightCol - 7 - (midCol - 4)) * t);
    const picRow = Math.round(agentRow + 1 + (agentRow - 9 - (agentRow + 1)) * t);
    cells.push(...spriteToCells(SPRITE_DRAW_ICON, picCol, picRow, "filled", 1.0));
  }
  // Sub-step 3: Picture lands in the center, check mark appears, inverted flash (3200ms - 4500ms)
  else if (elapsed >= 3200) {
    const picState = elapsed >= 3500 && elapsed <= 3700 ? "inverted" : "filled";
    cells.push(...spriteToCells(SPRITE_DRAW_ICON, midCol - 4, agentRow - 9, picState, 1.0));
    cells.push(...spriteToCells(SPRITE_CHECK_MARK, midCol + 5, agentRow - 8, "filled", 1.0));
  }

  return { cells };
}

/** SCENE 3: SCALE (4s) */
export function getScene3ScaleFrame(cols: number, rows: number, elapsed: number): SceneFrame {
  const cells: TargetCell[] = [];
  const midCol = Math.floor(cols / 2);
  const midRow = Math.floor(rows / 2);

  // Staggered crowd coordinates mathematically centered across grid
  const crowdCoords = getCrowdCoords(cols, rows);

  // Sub-step 1: Agent splits 1 -> 2 -> 4 -> 8 -> 16 starting from the exact center
  // Sub-step 2: Busy market coins between neighbors (1600ms - 3100ms)
  if (elapsed < 3100) {
    if (elapsed < 400) {
      // 1 Agent in the exact center of the canvas
      cells.push(...spriteToCells(SPRITE_MINI_AGENT, midCol - 2, midRow - 2, "filled", 1.0));
    } else if (elapsed < 800) {
      // 2 Agents placed symmetrically around center
      cells.push(...spriteToCells(SPRITE_MINI_AGENT, midCol - 12, midRow - 2, "filled", 1.0));
      cells.push(...spriteToCells(SPRITE_MINI_AGENT, midCol + 7, midRow - 2, "filled", 1.0));
    } else if (elapsed < 1200) {
      // 4 Agents in centered box
      cells.push(...spriteToCells(SPRITE_MINI_AGENT, midCol - 14, midRow - 7, "filled", 1.0));
      cells.push(...spriteToCells(SPRITE_MINI_AGENT, midCol + 9, midRow - 7, "filled", 1.0));
      cells.push(...spriteToCells(SPRITE_MINI_AGENT, midCol - 14, midRow + 4, "filled", 1.0));
      cells.push(...spriteToCells(SPRITE_MINI_AGENT, midCol + 9, midRow + 4, "filled", 1.0));
    } else if (elapsed < 1600) {
      // 8 Agents symmetrically distributed
      const subsetIndices = [1, 2, 4, 5, 6, 7, 9, 10];
      for (const idx of subsetIndices) {
        const pos = crowdCoords[idx];
        if (pos !== undefined) {
          cells.push(...spriteToCells(SPRITE_MINI_AGENT, pos.col, pos.row, "filled", 1.0));
        }
      }
    } else {
      // All 16 Agents active in the centered staggered lattice
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
    // Morph between crowd positions and QNTX targets
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

/** End state of PAY (used for prefers-reduced-motion) */
export function getReducedMotionPayFrame(cols: number, rows: number): SceneFrame {
  const cells: TargetCell[] = [];
  const isMobile = cols < CANVAS_CONFIG.mobile.breakpoint;

  const midCol = Math.floor(cols / 2);
  const agentRow = Math.floor(rows / 2) - 4;

  const leftCol = isMobile ? 4 : 6;
  const rightCol = isMobile ? cols - 11 : cols - 13;
  const pileCol = leftCol + 8;
  const pileRow = agentRow + 2;

  // Left agent with 2 coins
  cells.push(...spriteToCells(SPRITE_AGENT, leftCol, agentRow, "filled", 1.0));
  cells.push(...createCoinPile(pileCol, pileRow, 2));

  // Right agent (painter)
  cells.push(...spriteToCells(SPRITE_AGENT, rightCol, agentRow, "filled", 1.0));

  // Picture and check mark centered between the two agents
  cells.push(...spriteToCells(SPRITE_DRAW_ICON, midCol - 4, agentRow - 9, "filled", 1.0));
  cells.push(...spriteToCells(SPRITE_CHECK_MARK, midCol + 5, agentRow - 8, "filled", 1.0));

  return { cells };
}
