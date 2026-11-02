/**
 * QuantX Hero Canvas Sprites & Rasterization Helpers
 *
 * Strict 1-bit pixel matrix definitions and rasterization utilities for Agents, Coins, Speech
 * Bubbles, Pile bars, Icons, and Thinking dots.
 */

import { CANVAS_CONFIG } from "./config";
import { createPRNG } from "./particles";
import type { Cell, CellState, Sprite } from "./types";

/** Agent (9x9) */
export const SPRITE_AGENT: Sprite = {
  width: 9,
  height: 9,
  rows: [
    "....#....",
    ".#######.",
    "#########",
    "##.###.##",
    "##.###.##",
    "#########",
    ".#######.",
    "..#...#..",
    "..#...#..",
  ],
};

/** Mini Agent (5x5) for Scene 3 crowd */
export const SPRITE_MINI_AGENT: Sprite = {
  width: 5,
  height: 5,
  rows: [".###.", "#.#.#", "#####", ".###.", ".#.#."],
};

/** Coin (5x5) */
export const SPRITE_COIN: Sprite = {
  width: 5,
  height: 5,
  rows: [".###.", "#...#", "#.#.#", "#...#", ".###."],
};

/** Mini Coin (2x2 solid) for Scene 3 trading */
export const SPRITE_MINI_COIN: Sprite = {
  width: 2,
  height: 2,
  rows: ["##", "##"],
};

/** Document Icon (7x9) */
export const SPRITE_DOCUMENT_ICON: Sprite = {
  width: 7,
  height: 9,
  rows: [
    "#####..",
    "#....#.",
    "#.....#",
    "#.###.#",
    "#.....#",
    "#.###.#",
    "#.....#",
    "#.###.#",
    "#######",
  ],
};

/** Picture Icon (11x9) */
export const SPRITE_PICTURE_ICON: Sprite = {
  width: 11,
  height: 9,
  rows: [
    "###########",
    "#.........#",
    "#.##......#",
    "#.##......#",
    "#.....#...#",
    "#....###..#",
    "#...#####.#",
    "#.........#",
    "###########",
  ],
};

/** Check Mark (7x5) */
export const SPRITE_CHECK_MARK: Sprite = {
  width: 7,
  height: 5,
  rows: ["......#", ".....#.", "#...#..", ".#.#...", "..#...."],
};

/** Converts a Sprite bitmap into absolute grid Cells */
export function spriteToCells(
  sprite: Sprite,
  startCol: number,
  startRow: number,
  state: CellState = "filled",
  scale = 1.0,
): Cell[] {
  const cells: Cell[] = [];
  const { width, height, rows } = sprite;

  for (let r = 0; r < height; r++) {
    const rowStr = rows[r] ?? "";
    for (let c = 0; c < width; c++) {
      if (rowStr[c] === "#") {
        cells.push({
          col: startCol + c,
          row: startRow + r,
          state,
          scale,
        });
      }
    }
  }

  return cells;
}

/**
 * Returns cells for the 9x9 Agent sprite with dynamic eye state and FLASH support. Eye cells
 * (local): (2,3), (2,4), (6,3), (6,4).
 *
 * - OPEN: eyes empty
 * - BLINK: eyes filled
 * - HAPPY: lower eyes open ((2,4) and (6,4)), upper filled ((2,3) and (6,3))
 * - FLASH: all cells switch to "hollow"
 */
export function getAgentCells(
  topCol: number,
  topRow: number,
  eyeState: "open" | "blink" | "happy" = "open",
  isFlash = false,
  scale = 1.0,
): Cell[] {
  const cells: Cell[] = [];
  const state: CellState = isFlash ? "hollow" : "filled";

  for (let r = 0; r < 9; r++) {
    const rowStr = SPRITE_AGENT.rows[r] ?? "";
    for (let c = 0; c < 9; c++) {
      let filled = rowStr[c] === "#";

      // Eye cells check
      if ((c === 2 || c === 6) && (r === 3 || r === 4)) {
        if (eyeState === "blink") {
          filled = true; // Blink: eyes filled
        } else if (eyeState === "happy") {
          // Happy: only lower eye cells open ((2,4) and (6,4)); upper ones filled
          filled = r === 3;
        } else {
          // Open: eyes empty
          filled = false;
        }
      }

      if (filled) {
        cells.push({
          col: topCol + c,
          row: topRow + r,
          state,
          scale,
        });
      }
    }
  }

  return cells;
}

/** Returns cells for the 5x5 Mini Agent sprite */
export function getMiniAgentCells(
  topCol: number,
  topRow: number,
  isFlash = false,
  scale = 1.0,
): Cell[] {
  const cells: Cell[] = [];
  const state: CellState = isFlash ? "hollow" : "filled";

  for (let r = 0; r < 5; r++) {
    const rowStr = SPRITE_MINI_AGENT.rows[r] ?? "";
    for (let c = 0; c < 5; c++) {
      if (rowStr[c] === "#") {
        cells.push({
          col: topCol + c,
          row: topRow + r,
          state,
          scale,
        });
      }
    }
  }

  return cells;
}

/**
 * Three single thinking cells: row = agent top row - 2, cols = agent center col + 6, +8, +10.
 * Cycles every 200ms (1 dot -> 2 dots -> 3 dots -> loop).
 */
export function getThinkingDots(
  agentCenterCol: number,
  agentTopRow: number,
  elapsedMs: number,
): Cell[] {
  const cells: Cell[] = [];
  const row = agentTopRow - 2;
  const dotCols = [agentCenterCol + 6, agentCenterCol + 8, agentCenterCol + 10];
  const phase = Math.floor(elapsedMs / 200) % 3; // 0, 1, 2

  for (let i = 0; i <= phase; i++) {
    const col = dotCols[i];
    if (col !== undefined) {
      cells.push({
        col,
        row,
        state: "filled",
        scale: 1.0,
      });
    }
  }

  return cells;
}

/**
 * Speech Bubble: hollow rectangle 21 wide x 13 tall (outer border 1 cell, empty inside), centered
 * on the agent's center col (cols center-10..center+10, rows 6-18), plus downward tail at row 19 (3
 * cells: center-1..center+1) and row 20 (1 cell: center).
 */
export function getSpeechBubbleCells(centerCol: number, scale = 1.0): Cell[] {
  const cells: Cell[] = [];
  const startCol = centerCol - 10;
  const endCol = centerCol + 10;
  const topRow = CANVAS_CONFIG.positions.bubbleRowStart; // 6
  const bottomRow = CANVAS_CONFIG.positions.bubbleRowEnd; // 18

  // Top and bottom borders
  for (let c = startCol; c <= endCol; c++) {
    cells.push({ col: c, row: topRow, state: "filled", scale });
    cells.push({ col: c, row: bottomRow, state: "filled", scale });
  }

  // Left and right vertical borders
  for (let r = topRow + 1; r < bottomRow; r++) {
    cells.push({ col: startCol, row: r, state: "filled", scale });
    cells.push({ col: endCol, row: r, state: "filled", scale });
  }

  // Tail: 3 cells at row 19
  for (let c = centerCol - 1; c <= centerCol + 1; c++) {
    cells.push({ col: c, row: bottomRow + 1, state: "filled", scale });
  }

  // Tail: 1 cell at row 20
  cells.push({ col: centerCol, row: bottomRow + 2, state: "filled", scale });

  return cells;
}

/**
 * Pile: stacked flat coins. Each coin is a 7x1 solid bar at columns 49-55. Bars from bottom: rows
 * 33, 31, 29, 27.
 */
export function getPileCells(numBars: number): Cell[] {
  const cells: Cell[] = [];
  const barRows = CANVAS_CONFIG.positions.pileBars;

  for (let i = 0; i < numBars && i < barRows.length; i++) {
    const row = barRows[i];
    if (row !== undefined) {
      for (
        let c = CANVAS_CONFIG.positions.pileStartCol;
        c <= CANVAS_CONFIG.positions.pileEndCol;
        c++
      ) {
        cells.push({
          col: c,
          row,
          state: "filled",
          scale: 1.0,
        });
      }
    }
  }

  return cells;
}

/**
 * Build effect: cells fly out in straight lines from sender antenna cell to targets over duration
 * (~0.3s).
 */
export function applyBuildEffect(
  targetCells: ReadonlyArray<Cell>,
  antennaCol: number,
  antennaRow: number,
  progress: number,
): Cell[] {
  const p = Math.max(0, Math.min(1, progress));
  return targetCells.map((tc) => ({
    col: Math.round(antennaCol + (tc.col - antennaCol) * p),
    row: Math.round(antennaRow + (tc.row - antennaRow) * p),
    state: tc.state,
    scale: 1.0,
  }));
}

/** Disappear effect: cells scale to 0 with a short pseudo-random stagger. */
export function applyDisappearEffect(
  targetCells: ReadonlyArray<Cell>,
  progress: number,
  seed = 42,
): Cell[] {
  const prng = createPRNG(seed);
  return targetCells.map((tc) => {
    const delay = prng() * 0.4;
    const effectiveP = Math.max(0, Math.min(1, (progress - delay) / 0.6));
    const scale = Math.max(0, 1.0 - effectiveP);
    return {
      col: tc.col,
      row: tc.row,
      state: tc.state,
      scale,
    };
  });
}
