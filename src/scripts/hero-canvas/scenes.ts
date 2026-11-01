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

/** Neighbor pairs for busy market coins in Scene 3 (SCALE) */
const COIN_FLIGHT_PAIRS = [
  { from: 0, to: 8, phase: 0 },
  { from: 7, to: 14, phase: 150 },
  { from: 3, to: 4, phase: 300 },
  { from: 11, to: 12, phase: 450 },
  { from: 18, to: 19, phase: 200 },
  { from: 22, to: 29, phase: 350 },
  { from: 25, to: 26, phase: 100 },
  { from: 1, to: 9, phase: 250 },
] as const;

/** Computes 30 staggered coordinates mathematically centered across the canvas */
function getCrowdCoords(cols: number, rows: number): TargetCell[] {
  const midCol = Math.floor(cols / 2);
  const midRow = Math.floor(rows / 2);
  const isMobile = cols < CANVAS_CONFIG.mobile.breakpoint;

  const rowY = isMobile
    ? [midRow - 12, midRow - 4, midRow + 4, midRow + 12]
    : [midRow - 14, midRow - 5, midRow + 4, midRow + 13];

  if (isMobile) {
    // 16 agents on mobile to maintain clean integer spacing
    const outer = 24;
    const inner = 8;
    const stagOuter = 16;
    const stagInner = 1;

    const r0 = [
      { col: midCol - outer, row: rowY[0] ?? midRow - 12 },
      { col: midCol - inner, row: rowY[0] ?? midRow - 12 },
      { col: midCol + inner - 5, row: rowY[0] ?? midRow - 12 },
      { col: midCol + outer - 5, row: rowY[0] ?? midRow - 12 },
    ];
    const r1 = [
      { col: midCol - stagOuter, row: rowY[1] ?? midRow - 4 },
      { col: midCol - stagInner - 2, row: rowY[1] ?? midRow - 4 },
      { col: midCol + stagInner - 3, row: rowY[1] ?? midRow - 4 },
      { col: midCol + stagOuter - 5, row: rowY[1] ?? midRow - 4 },
    ];
    const r2 = [
      { col: midCol - outer, row: rowY[2] ?? midRow + 4 },
      { col: midCol - inner, row: rowY[2] ?? midRow + 4 },
      { col: midCol + inner - 5, row: rowY[2] ?? midRow + 4 },
      { col: midCol + outer - 5, row: rowY[2] ?? midRow + 4 },
    ];
    const r3 = [
      { col: midCol - stagOuter, row: rowY[3] ?? midRow + 12 },
      { col: midCol - stagInner - 2, row: rowY[3] ?? midRow + 12 },
      { col: midCol + stagInner - 3, row: rowY[3] ?? midRow + 12 },
      { col: midCol + stagOuter - 5, row: rowY[3] ?? midRow + 12 },
    ];
    return [...r0, ...r1, ...r2, ...r3];
  }

  // 30 mini agents on desktop (8 + 7 + 8 + 7 lattice)
  const offsets8 = [-39, -28, -17, -6, 1, 12, 23, 34];
  const r0 = offsets8.map((off) => ({ col: midCol + off, row: rowY[0] ?? midRow - 14 }));
  const r2 = offsets8.map((off) => ({ col: midCol + off, row: rowY[2] ?? midRow + 4 }));

  const offsets7 = [-33, -22, -11, -2, 7, 18, 29];
  const r1 = offsets7.map((off) => ({ col: midCol + off, row: rowY[1] ?? midRow - 5 }));
  const r3 = offsets7.map((off) => ({ col: midCol + off, row: rowY[3] ?? midRow + 13 }));

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

  // Wide, symmetric positioning across the broad canvas
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

  // Staggered crowd coordinates mathematically centered across grid (up to 30 agents)
  const crowdCoords = getCrowdCoords(cols, rows);

  // Sub-step 1: Agent splits 1 -> 2 -> 4 -> 8 -> 16 -> 30 starting from the exact center
  // Sub-step 2: Busy market coins between neighbors (1600ms - 3100ms)
  if (elapsed < 3100) {
    if (elapsed < 300) {
      // 1 Agent in the exact center of the canvas
      cells.push(...spriteToCells(SPRITE_MINI_AGENT, midCol - 2, midRow - 3, "filled", 1.0));
    } else if (elapsed < 600) {
      // 2 Agents placed symmetrically around center
      cells.push(...spriteToCells(SPRITE_MINI_AGENT, midCol - 12, midRow - 3, "filled", 1.0));
      cells.push(...spriteToCells(SPRITE_MINI_AGENT, midCol + 7, midRow - 3, "filled", 1.0));
    } else if (elapsed < 900) {
      // 4 Agents in centered box
      cells.push(...spriteToCells(SPRITE_MINI_AGENT, midCol - 14, midRow - 7, "filled", 1.0));
      cells.push(...spriteToCells(SPRITE_MINI_AGENT, midCol + 9, midRow - 7, "filled", 1.0));
      cells.push(...spriteToCells(SPRITE_MINI_AGENT, midCol - 14, midRow + 4, "filled", 1.0));
      cells.push(...spriteToCells(SPRITE_MINI_AGENT, midCol + 9, midRow + 4, "filled", 1.0));
    } else if (elapsed < 1200) {
      // 8 Agents symmetrically distributed
      const subset8 = [3, 4, 10, 11, 18, 19, 25, 26];
      for (const idx of subset8) {
        const pos = crowdCoords[idx % crowdCoords.length];
        if (pos !== undefined) {
          cells.push(...spriteToCells(SPRITE_MINI_AGENT, pos.col, pos.row, "filled", 1.0));
        }
      }
    } else if (elapsed < 1500) {
      // 16 Agents symmetrically distributed
      const subset16 = [1, 2, 5, 6, 9, 10, 12, 13, 16, 17, 20, 21, 24, 25, 27, 28];
      for (const idx of subset16) {
        const pos = crowdCoords[idx % crowdCoords.length];
        if (pos !== undefined) {
          cells.push(...spriteToCells(SPRITE_MINI_AGENT, pos.col, pos.row, "filled", 1.0));
        }
      }
    } else {
      // All mini Agents active in the centered staggered lattice (30 agents on desktop)
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

        const fromPos = crowdCoords[flight.from % crowdCoords.length];
        const toPos = crowdCoords[flight.to % crowdCoords.length];
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
