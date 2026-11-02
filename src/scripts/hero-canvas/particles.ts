/**
 * QuantX Hero Canvas Particle Morphing System
 *
 * Implements a fixed pool of square particles that morph between states, dissolve transitions with
 * seeded PRNG stagger, and uniform linear whole-cell snapping.
 */

import { CANVAS_CONFIG } from "./config";
import type { Cell, Particle } from "./types";

/** Seeded Lehmer PRNG (no bitwise operators) */
export function createPRNG(seed: number): () => number {
  let s = Math.abs(seed) % 2147483647;
  if (s <= 0) {
    s = 1;
  }
  return function next(): number {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export class ParticlePool {
  private particles: Particle[] = [];
  private readonly poolSize: number;
  private currentDissolveDuration = 800;

  constructor(poolSize = CANVAS_CONFIG.poolSize) {
    this.poolSize = poolSize;
    this.init();
  }

  private init(): void {
    this.particles = [];
    for (let i = 0; i < this.poolSize; i++) {
      this.particles.push({
        col: 0,
        row: 0,
        fromCol: 0,
        fromRow: 0,
        targetCol: 0,
        targetRow: 0,
        state: "filled",
        targetState: "filled",
        scale: 0,
        fromScale: 0,
        targetScale: 0,
        delay: 0,
        active: false,
      });
    }
  }

  getParticles(): ReadonlyArray<Particle> {
    return this.particles;
  }

  /**
   * Set targets directly for frame-by-frame continuous scene animation. Surplus particles park at
   * scale 0.
   */
  setImmediateTargets(targets: ReadonlyArray<Cell>): void {
    const targetCount = targets.length;
    for (let i = 0; i < this.poolSize; i++) {
      const p = this.particles[i];
      if (p === undefined) {
        continue;
      }

      if (i < targetCount) {
        const t = targets[i];
        if (t !== undefined) {
          p.col = t.col;
          p.row = t.row;
          p.fromCol = t.col;
          p.fromRow = t.row;
          p.targetCol = t.col;
          p.targetRow = t.row;
          p.state = t.state;
          p.targetState = t.state;
          p.scale = t.scale ?? 1.0;
          p.fromScale = p.scale;
          p.targetScale = p.scale;
          p.delay = 0;
          p.active = p.scale > 0.01;
        }
      } else {
        p.scale = 0;
        p.fromScale = 0;
        p.targetScale = 0;
        p.active = false;
      }
    }
  }

  /**
   * Starts a dissolve transition to new targets. Particles break loose with random stagger up to
   * maxStaggerDelay (seeded PRNG) and travel in straight lines to target positions over duration.
   */
  startDissolve(
    targets: ReadonlyArray<Cell>,
    durationMs = 800,
    seed: number = CANVAS_CONFIG.prngSeed,
  ): void {
    this.currentDissolveDuration = durationMs;
    const prng = createPRNG(seed);
    const targetCount = targets.length;
    const maxStagger = Math.min(CANVAS_CONFIG.timings.maxStaggerDelay, durationMs * 0.5);

    for (let i = 0; i < this.poolSize; i++) {
      const p = this.particles[i];
      if (p === undefined) {
        continue;
      }

      p.fromCol = p.col;
      p.fromRow = p.row;
      p.fromScale = p.scale;

      if (i < targetCount) {
        const t = targets[i];
        if (t !== undefined) {
          p.targetCol = t.col;
          p.targetRow = t.row;
          p.targetState = t.state;
          p.targetScale = t.scale ?? 1.0;
          p.delay = prng() * maxStagger;
          p.active = true;
        }
      } else {
        // Surplus particles park at scale 0
        p.targetScale = 0;
        p.delay = prng() * (maxStagger / 2);
        p.active = false;
      }
    }
  }

  /**
   * Update dissolve progression. Motion: strictly uniform and linear, snapped to whole cells at 30
   * ticks/second.
   */
  updateDissolve(progress: number): void {
    const totalDuration = this.currentDissolveDuration;
    const elapsed = progress * totalDuration;

    for (const p of this.particles) {
      if (!p.active && p.scale <= 0.01 && p.fromScale <= 0.01) {
        continue;
      }

      if (elapsed < p.delay) {
        p.col = p.fromCol;
        p.row = p.fromRow;
        p.scale = p.fromScale;
      } else {
        const travelDuration = Math.max(1, totalDuration - p.delay);
        const t = Math.min(1, (elapsed - p.delay) / travelDuration);

        // Linear whole-cell snapping
        p.col = Math.round(p.fromCol + (p.targetCol - p.fromCol) * t);
        p.row = Math.round(p.fromRow + (p.targetRow - p.fromRow) * t);
        p.scale = p.fromScale + (p.targetScale - p.fromScale) * t;

        if (t >= 0.5) {
          p.state = p.targetState;
        }
      }
    }
  }
}
