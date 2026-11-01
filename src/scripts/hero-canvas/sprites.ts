/**
 * QuantX Hero Canvas Sprites
 *
 * Exact bitmap sprite matrices and rasterization helpers for Agents, Coins, Speech Bubbles, and
 * Icons.
 */

import type { CellState, SpriteData, TargetCell } from "./types";

/** Agent (7x7) with eyes at column 1 and 5 */
export const SPRITE_AGENT: SpriteData = {
  width: 7,
  height: 7,
  rows: ["...#...", "#######", "#.###.#", "#######", "#######", "#######", "##...##"],
};

/** Agent (7x7) in blinking state (eyes filled) */
export const SPRITE_AGENT_BLINK: SpriteData = {
  width: 7,
  height: 7,
  rows: ["...#...", "#######", "#######", "#######", "#######", "#######", "##...##"],
};

/** Mini Agent (5x5) for the crowd scene */
export const SPRITE_MINI_AGENT: SpriteData = {
  width: 5,
  height: 5,
  rows: ["#####", "#.#.#", "#####", "#####", "#...#"],
};

/** Coin (5x5) */
export const SPRITE_COIN: SpriteData = {
  width: 5,
  height: 5,
  rows: [".###.", "#...#", "#.#.#", "#...#", ".###."],
};

/** Moon (5x6) */
export const SPRITE_MOON: SpriteData = {
  width: 5,
  height: 6,
  rows: [".###.", "##...", "#....", "#....", "##...", ".###."],
};

/** Speech Bubble (11x8) with 2-cell tail pointing down-left */
export const SPRITE_SPEECH_BUBBLE: SpriteData = {
  width: 11,
  height: 8,
  rows: [
    "###########",
    "#.........#",
    "#.........#",
    "#.........#",
    "#.........#",
    "#.........#",
    "###########",
    "##.........",
  ],
};

/** TRANSLATE icon (7x4): two overlapping speech bubbles */
export const SPRITE_TRANSLATE_ICON: SpriteData = {
  width: 7,
  height: 4,
  rows: ["####...", "#..#...", "####.##", "..#..##"],
};

/** DRAW icon (7x5): frame with sun cell at top-right and 2-peak mountain */
export const SPRITE_DRAW_ICON: SpriteData = {
  width: 7,
  height: 5,
  rows: ["#######", "#...#.#", "#.#...#", "###.###", "#######"],
};

/** DONE check mark (5x4) */
export const SPRITE_CHECK_MARK: SpriteData = {
  width: 5,
  height: 4,
  rows: ["....#", "...#.", "#.#..", ".#..."],
};

/** Converts a SpriteData definition into absolute grid TargetCells */
export function spriteToCells(
  sprite: SpriteData,
  startCol: number,
  startRow: number,
  state: CellState = "filled",
  scale = 1.0,
): TargetCell[] {
  const cells: TargetCell[] = [];
  const { rows, height, width } = sprite;

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

/** Three single thinking cells above the agent's head */
export function createThinkingDots(
  agentCol: number,
  agentRow: number,
  count: number,
): TargetCell[] {
  const cells: TargetCell[] = [];
  const dotCols = [agentCol + 1, agentCol + 3, agentCol + 5];

  for (let i = 0; i < count && i < 3; i++) {
    const col = dotCols[i];
    if (col !== undefined) {
      cells.push({
        col,
        row: agentRow - 3,
        state: "filled",
        scale: 1.0,
      });
    }
  }

  return cells;
}

/** Staircase stack of 5x5 coin sprites */
export function createCoinPile(
  startCol: number,
  startRow: number,
  coinCount: number,
): TargetCell[] {
  const cells: TargetCell[] = [];

  for (let i = 0; i < coinCount; i++) {
    const offsetCol = startCol + i * 2;
    const offsetRow = startRow - i * 2;
    cells.push(...spriteToCells(SPRITE_COIN, offsetCol, offsetRow, "filled", 1.0));
  }

  return cells;
}
