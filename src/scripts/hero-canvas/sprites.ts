/**
 * QuantX Hero Canvas Sprites & Rasterization Helpers
 *
 * Strict 1-bit pixel matrix definitions and rasterization utilities for Agents, Coins, Speech
 * Bubbles, Icons, and x402 Glyphs.
 */

import { CANVAS_CONFIG } from "./config";
import { createPRNG } from "./particles";
import type { Cell, CellState, Sprite } from "./types";

/** Full-size Piggy-Bank Agent (9x9) silhouette with top coin slot */
export const SPRITE_AGENT: Sprite = {
  width: 9,
  height: 9,
  rows: [
    "###...###",
    "#########",
    "##.###.##",
    "##.###.##",
    "#########",
    "#########",
    "#########",
    ".##...##.",
    ".##...##.",
  ],
};

/** Mini Piggy-Bank Agent (7x6) for Scene 2 crowd */
export const SPRITE_MINI_AGENT: Sprite = {
  width: 7,
  height: 6,
  rows: ["##...##", "#######", "#.###.#", "#######", "#######", ".#...#."],
};

/** Coin (5x5) */
export const SPRITE_COIN: Sprite = {
  width: 5,
  height: 5,
  rows: [".###.", "#...#", "#.#.#", "#...#", ".###."],
};

/** Mini Coin (2x2 solid) for Scene 2 trading */
export const SPRITE_MINI_COIN: Sprite = {
  width: 2,
  height: 2,
  rows: ["##", "##"],
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

/** Pixel Glyphs (3x5) strictly for "x402" */
export const PIXEL_GLYPHS: Record<"x" | "4" | "0" | "2", Sprite> = {
  x: {
    width: 3,
    height: 5,
    rows: ["#.#", "#.#", ".#.", "#.#", "#.#"],
  },
  "4": {
    width: 3,
    height: 5,
    rows: ["#.#", "#.#", "###", "..#", "..#"],
  },
  "0": {
    width: 3,
    height: 5,
    rows: ["###", "#.#", "#.#", "#.#", "###"],
  },
  "2": {
    width: 3,
    height: 5,
    rows: ["###", "..#", "###", "#..", "###"],
  },
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
 * Returns cells for the 9x9 Agent sprite with dynamic eye state, FLASH and jump support. Eye cells
 * (local): (2,2), (2,3), (6,2), (6,3).
 *
 * - OPEN: eyes empty
 * - BLINK: all four eye cells filled
 * - HAPPY: upper eyes (2,2), (6,2) filled; lower ones (2,3), (6,3) open (squint-smile)
 * - FLASH: all cells switch to "hollow" for 120ms
 * - Optional jump: moves up 1 cell
 */
export function getAgentCells(
  topCol: number,
  topRow: number,
  eyeState: "open" | "blink" | "happy" = "open",
  isFlash = false,
  scale = 1.0,
  isJumping = false,
): Cell[] {
  const cells: Cell[] = [];
  const state: CellState = isFlash ? "hollow" : "filled";
  const effectiveTopRow = isJumping ? topRow - 1 : topRow;

  for (let r = 0; r < 9; r++) {
    const rowStr = SPRITE_AGENT.rows[r] ?? "";
    for (let c = 0; c < 9; c++) {
      let filled = rowStr[c] === "#";

      // Eye cells check: (2,2), (2,3), (6,2), (6,3)
      if ((c === 2 || c === 6) && (r === 2 || r === 3)) {
        if (eyeState === "blink") {
          filled = true; // Blink: all 4 eye cells filled
        } else if (eyeState === "happy") {
          // Happy squint: upper eye cells filled, lower ones open
          filled = r === 2;
        } else {
          // Open: eyes empty
          filled = false;
        }
      }

      if (filled) {
        cells.push({
          col: topCol + c,
          row: effectiveTopRow + r,
          state,
          scale,
        });
      }
    }
  }

  return cells;
}

/** Returns cells for the 7x6 Mini Agent sprite */
export function getMiniAgentCells(
  topCol: number,
  topRow: number,
  isFlash = false,
  scale = 1.0,
): Cell[] {
  const cells: Cell[] = [];
  const state: CellState = isFlash ? "hollow" : "filled";

  for (let r = 0; r < 6; r++) {
    const rowStr = SPRITE_MINI_AGENT.rows[r] ?? "";
    for (let c = 0; c < 7; c++) {
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
 * Three single thinking cells: row = agent top row - 3, columns = agent center col + 6, +8, +10.
 * Cycles every 200ms (1 dot -> 2 dots -> 3 dots -> loop).
 */
export function getThinkingDots(
  agentCenterCol: number,
  agentTopRow: number,
  elapsedMs: number,
): Cell[] {
  const cells: Cell[] = [];
  const row = agentTopRow - 3;
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
 * Paying emergence (0.1s): Cells emerge one by one from the slot cell (center col, slot row 25) and
 * move straight up, forming a vertical bar of 1 column x 5 rows standing directly above the sprite
 * (rows top-5..top-1: rows 20-24).
 */
export function getCoinEmergenceCells(
  slotCenterCol: number,
  slotRow: number,
  progress: number,
): Cell[] {
  const cells: Cell[] = [];
  const p = Math.max(0, Math.min(1, progress));
  const numCells = Math.min(5, Math.max(1, Math.ceil(p * 5)));
  for (let i = 0; i < numCells; i++) {
    const targetRow = slotRow - 5 + i; // 20, 21, 22, 23, 24
    const r = Math.round(slotRow - (5 - i) * p);
    const row = Math.max(targetRow, Math.min(slotRow - 1, r));
    cells.push({
      col: slotCenterCol,
      row,
      state: "filled",
      scale: 1.0,
    });
  }
  return cells;
}

/** Bar unfolds into 5x5 coin at centerCol, center row 22 (rows 20-24) over ~0.1s. */
export function getCoinUnfoldCells(centerCol: number, centerRow: number, progress: number): Cell[] {
  const cells: Cell[] = [];
  const p = Math.max(0, Math.min(1, progress));
  const topRow = centerRow - 2; // 20
  const leftCol = centerCol - 2;

  for (let r = 0; r < 5; r++) {
    const rowStr = SPRITE_COIN.rows[r] ?? "";
    for (let c = 0; c < 5; c++) {
      if (rowStr[c] === "#") {
        const targetCol = leftCol + c;
        const targetRow = topRow + r;
        const currentCol = Math.round(centerCol + (targetCol - centerCol) * p);
        cells.push({
          col: currentCol,
          row: targetRow,
          state: "filled",
          scale: 1.0,
        });
      }
    }
  }
  return cells;
}

/** 5x5 coin squashes into 1x5 vertical bar standing directly above slot (rows 20-24) over ~0.1s. */
export function getCoinSquashCells(centerCol: number, centerRow: number, progress: number): Cell[] {
  const cells: Cell[] = [];
  const p = Math.max(0, Math.min(1, progress));
  const topRow = centerRow - 2; // 20
  const leftCol = centerCol - 2;

  for (let r = 0; r < 5; r++) {
    const rowStr = SPRITE_COIN.rows[r] ?? "";
    for (let c = 0; c < 5; c++) {
      if (rowStr[c] === "#") {
        const targetCol = leftCol + c;
        const targetRow = topRow + r;
        const currentCol = Math.round(targetCol + (centerCol - targetCol) * p);
        cells.push({
          col: currentCol,
          row: targetRow,
          state: "filled",
          scale: 1.0,
        });
      }
    }
  }
  return cells;
}

/**
 * 1x5 bar descends 1 cell per tick straight down into the slot, vanishing into the head. Cells that
 * have reached or passed the slot row (top row: 25) are no longer rendered.
 */
export function getCoinDescendCells(
  slotCenterCol: number,
  slotRow: number,
  progress: number,
): Cell[] {
  const cells: Cell[] = [];
  const p = Math.max(0, Math.min(1, progress));
  // In 0.2s (6 ticks), bar descends 5-6 rows
  const shift = Math.round(p * 5);

  for (let i = 0; i < 5; i++) {
    const initialRow = slotRow - 5 + i; // 20, 21, 22, 23, 24
    const row = initialRow + shift;
    if (row < slotRow) {
      cells.push({
        col: slotCenterCol,
        row,
        state: "filled",
        scale: 1.0,
      });
    }
  }
  return cells;
}

/**
 * Speech Bubble: hollow rectangle 27 wide x 13 tall (outer border 1 cell, empty inside), centered
 * on the agent's center col (cols center-13..center+13, rows 6-18), downward tail: row 19 (3 cells:
 * center-1..center+1), row 20 (1 cell: center).
 */
export function getSpeechBubbleCells(centerCol: number, scale = 1.0): Cell[] {
  const cells: Cell[] = [];
  const startCol = centerCol - 13;
  const endCol = centerCol + 13;
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

/** Spells "x402" with 1 empty column between 3x5 glyphs (total 15 wide x 5 tall) */
export function getGlyphTextCells(startCol: number, startRow: number, scale = 1.0): Cell[] {
  const cells: Cell[] = [];
  const chars: ReadonlyArray<"x" | "4" | "0" | "2"> = ["x", "4", "0", "2"];

  let offsetCol = startCol;
  for (const char of chars) {
    const glyph = PIXEL_GLYPHS[char];
    cells.push(...spriteToCells(glyph, offsetCol, startRow, "filled", scale));
    offsetCol += glyph.width + 1; // 3 width + 1 empty col
  }

  return cells;
}

/**
 * Payment-Required Bubble Content: COIN (5 wide) + 2 empty cols + "x402" text (15 wide) = 22 wide x
 * 5 tall. Centered horizontally inside bubble centered at centerCol.
 */
export function getPaymentBubbleContentCells(centerCol: number, topRow = 10, scale = 1.0): Cell[] {
  const cells: Cell[] = [];
  const startCol = centerCol - 11; // 22 wide centered: start at center - 11

  // 1. Coin (5x5) at cols startCol .. startCol + 4
  cells.push(...spriteToCells(SPRITE_COIN, startCol, topRow, "filled", scale));

  // 2. "x402" text at cols startCol + 7 .. startCol + 21
  cells.push(...getGlyphTextCells(startCol + 7, topRow, scale));

  return cells;
}

/** Build effect: cells fly out in straight lines from sender head to targets within ~0.3s. */
export function applyBuildEffect(
  targetCells: ReadonlyArray<Cell>,
  senderCol: number,
  senderRow: number,
  progress: number,
): Cell[] {
  const p = Math.max(0, Math.min(1, progress));
  return targetCells.map((tc) => ({
    col: Math.round(senderCol + (tc.col - senderCol) * p),
    row: Math.round(senderRow + (tc.row - senderRow) * p),
    state: tc.state,
    scale: 1.0,
  }));
}

/** Vanish effect: cells scale to 0 with a short pseudo-random stagger (~0.2s). */
export function applyVanishEffect(
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
