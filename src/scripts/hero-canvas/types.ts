/**
 * QuantX Hero Canvas Type Definitions
 *
 * Strict TypeScript types for cells, sprites, beats, and particles.
 */

export type CellState = "filled" | "hollow" | "none";

/** Individual square unit on the canvas grid */
export type Cell = {
  readonly col: number;
  readonly row: number;
  readonly state: CellState;
  readonly scale?: number;
};

/** Matrix bitmap sprite specification */
export type Sprite = {
  readonly width: number;
  readonly height: number;
  readonly rows: ReadonlyArray<string>;
};

export type SceneIndex = 0 | 1;
// 0: Scene 1 (x402 Payment)
// 1: Scene 2 (Crowd & Trading)

export function isSceneIndex(val: number): val is SceneIndex {
  return val === 0 || val === 1;
}

/** Timed beat descriptor for data-driven scene choreography */
export type Beat = {
  readonly name: string;
  readonly startMs: number;
  readonly endMs: number;
};

/** Dynamic particle unit in the morphing pool */
export type Particle = {
  col: number;
  row: number;
  fromCol: number;
  fromRow: number;
  targetCol: number;
  targetRow: number;
  state: CellState;
  targetState: CellState;
  scale: number;
  fromScale: number;
  targetScale: number;
  delay: number;
  active: boolean;
};

/** A rendered frame consisting of target cells */
export type SceneFrame = {
  readonly cells: ReadonlyArray<Cell>;
};
