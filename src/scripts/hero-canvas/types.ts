/**
 * QuantX Hero Canvas Type Definitions
 *
 * Strict TypeScript types for cells, sprites, scenes, particles, and network packets.
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

export type SceneIndex = 0 | 1 | 2;
// 0: EARN
// 1: PAY
// 2: SCALE (ends by assembling QNTX, followed by QNTX hold)

export function isSceneIndex(val: number): val is SceneIndex {
  return val === 0 || val === 1 || val === 2;
}

/** Definition of a narrative scene */
export type Scene = {
  readonly id: SceneIndex;
  readonly name: string;
  readonly duration: number; // Duration in milliseconds
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

/** Network trading coin packet moving between agents */
export type Packet = {
  readonly fromAgent: number;
  readonly toAgent: number;
  col: number;
  row: number;
  readonly startCol: number;
  readonly startRow: number;
  readonly targetCol: number;
  readonly targetRow: number;
  readonly startTime: number;
  readonly duration: number;
  active: boolean;
};

/** A rendered frame consisting of target cells */
export type SceneFrame = {
  readonly cells: ReadonlyArray<Cell>;
};
