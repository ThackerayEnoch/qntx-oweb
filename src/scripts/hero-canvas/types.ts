/** QuantX Hero Canvas Type Definitions */

export type CellState = "filled" | "hollow" | "inverted";

export type TargetCell = {
  readonly col: number;
  readonly row: number;
  readonly state?: CellState;
  readonly scale?: number;
};

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

export type SpriteData = {
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

export type SceneFrame = {
  readonly cells: ReadonlyArray<TargetCell>;
};
