/**
 * QuantX Hero Canvas Engine
 *
 * Implements fixed square grid layout, 30 ticks/second mechanical timestep accumulator,
 * stage-to-real-grid projection with horizontal compression factor k = max(0.6, realCols / 128),
 * integer pixel alignment, reduced-motion handling, and lifecycle cleanup.
 */

import { CANVAS_CONFIG } from "./config";
import { ParticlePool } from "./particles";
import {
  getQntxFrame,
  getReducedMotionScene1Frame,
  getScene1PaymentFrame,
  getScene2CrowdFrame,
} from "./scenes";
import { CanvasTimeline, type TimelinePhase, type TimelineState } from "./timeline";
import type { Cell } from "./types";

export class HeroCanvasEngine {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly timeline: CanvasTimeline;
  private readonly particlePool: ParticlePool;

  // Grid dimensions
  private realCols = 128;
  private realRows = 40;
  private cellSize = CANVAS_CONFIG.grid.cellSize; // 6
  private gap = CANVAS_CONFIG.grid.gap; // 1
  private originX = 0;
  private originY = 0;
  private dpr = 1;
  private compressionK = 1.0;
  private isMobile = false;

  // Animation Loop State
  private rafId: number | undefined = undefined;
  private lastTime = 0;
  private accumulator = 0;
  private readonly tickDuration = 1000 / CANVAS_CONFIG.tickRate; // 33.333ms

  private isVisible = true;
  private isReducedMotion = false;
  private reducedMotionTimer = 0;
  private reducedMotionFrame: "QNTX" | "SCENE_1" = "QNTX";
  private reducedMotionOpacity = 1.0;

  // Phase transition tracking
  private previousPhase: TimelinePhase = "INTRO_BUILD";
  private scene2RegatherTriggered = false;

  // Observers & Listeners
  private intersectionObserver?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;
  private resizeDebounceTimer?: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (context === null) {
      throw new Error("Failed to get 2D context from canvas");
    }
    this.ctx = context;

    this.timeline = new CanvasTimeline();
    this.particlePool = new ParticlePool(CANVAS_CONFIG.poolSize);

    this.checkReducedMotion();
    this.initGrid();
    this.setupListeners();
    this.setupObservers();

    // Start with Intro QNTX Frame
    const initialFrame = getQntxFrame(0, true, this.compressionK);
    this.particlePool.setImmediateTargets(initialFrame.cells);

    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.renderLoop);
  }

  getTimeline(): CanvasTimeline {
    return this.timeline;
  }

  private checkReducedMotion(): void {
    if (typeof window !== "undefined") {
      this.isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
  }

  private initGrid(): void {
    const rect = this.canvas.getBoundingClientRect();
    const cssW = Math.max(rect.width, 300);
    const cssH = Math.max(rect.height, 200);

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(cssW * this.dpr);
    this.canvas.height = Math.floor(cssH * this.dpr);

    this.isMobile = cssW < CANVAS_CONFIG.grid.mobileBreakpoint;
    this.cellSize = CANVAS_CONFIG.grid.cellSize;
    this.gap = CANVAS_CONFIG.grid.gap;

    const cellStep = this.cellSize + this.gap;

    // Compute real columns and rows from canvas size
    this.realCols = Math.max(CANVAS_CONFIG.grid.minCols, Math.floor((cssW + this.gap) / cellStep));
    this.realRows = Math.max(CANVAS_CONFIG.grid.minRows, Math.floor((cssH + this.gap) / cellStep));

    // Horizontal compression factor k = max(0.6, realCols / 128)
    const ratio = this.realCols / CANVAS_CONFIG.stage.cols;
    this.compressionK =
      this.realCols >= CANVAS_CONFIG.stage.cols ? 1.0 : Math.max(CANVAS_CONFIG.grid.minK, ratio);

    const gridTotalW = this.realCols * this.cellSize + (this.realCols - 1) * this.gap;
    const gridTotalH = this.realRows * this.cellSize + (this.realRows - 1) * this.gap;

    // Origin centers the real grid perfectly inside canvas CSS bounds
    this.originX = Math.floor((cssW - gridTotalW) / 2);
    this.originY = Math.floor((cssH - gridTotalH) / 2);
  }

  private setupListeners(): void {
    window.addEventListener("resize", this.handleResize);

    // Canvas Hover: pause timeline, leave resumes
    this.canvas.addEventListener("mouseenter", () => {
      this.timeline.pause();
    });
    this.canvas.addEventListener("mouseleave", () => {
      this.timeline.resume();
    });

    // Page visibility
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }

  private readonly handleResize = (): void => {
    if (this.resizeDebounceTimer !== undefined) {
      clearTimeout(this.resizeDebounceTimer);
    }
    this.resizeDebounceTimer = window.setTimeout(() => {
      this.initGrid();
    }, 100);
  };

  private readonly handleVisibilityChange = (): void => {
    if (document.hidden) {
      this.isVisible = false;
    } else {
      this.isVisible = true;
      this.lastTime = performance.now();
      this.accumulator = 0;
    }
  };

  private setupObservers(): void {
    if (typeof IntersectionObserver !== "undefined") {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry !== undefined) {
            this.isVisible = entry.isIntersecting;
            if (this.isVisible) {
              this.lastTime = performance.now();
              this.accumulator = 0;
            }
          }
        },
        { threshold: 0.1 },
      );
      this.intersectionObserver.observe(this.canvas);
    }

    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => {
        this.initGrid();
      });
      this.resizeObserver.observe(this.canvas);
    }
  }

  /** Gets target cells for a specific timeline state */
  private getTargetCellsForState(state: TimelineState): ReadonlyArray<Cell> {
    let cells: ReadonlyArray<Cell>;
    switch (state.phase) {
      case "INTRO_BUILD": {
        ({ cells } = getQntxFrame(state.elapsedInPhase, true, this.compressionK));
        break;
      }
      case "QNTX_HOLD": {
        ({ cells } = getQntxFrame(state.elapsedInPhase, false, this.compressionK));
        break;
      }
      case "SCENE_1": {
        ({ cells } = getScene1PaymentFrame(state.elapsedInPhase, this.compressionK));
        break;
      }
      case "SCENE_2": {
        if (state.elapsedInPhase >= 3200) {
          ({ cells } = getQntxFrame(0, false, this.compressionK));
        } else {
          ({ cells } = getScene2CrowdFrame(state.elapsedInPhase, this.isMobile, this.compressionK));
        }
        break;
      }
    }
    return cells;
  }

  private readonly renderLoop = (timestamp: number): void => {
    const deltaMs = Math.min(100, timestamp - this.lastTime);
    this.lastTime = timestamp;

    if (this.isVisible) {
      if (this.isReducedMotion) {
        this.updateReducedMotion(deltaMs);
        this.renderReducedMotion();
      } else {
        // Fixed 30 ticks/second accumulator
        this.accumulator += deltaMs;
        while (this.accumulator >= this.tickDuration) {
          this.step(this.tickDuration);
          this.accumulator -= this.tickDuration;
        }
        this.render();
      }
    }

    this.rafId = requestAnimationFrame(this.renderLoop);
  };

  private step(tickMs: number): void {
    const state = this.timeline.update(tickMs);

    // Detect phase transitions for starting dissolve transitions
    if (state.phase !== this.previousPhase) {
      this.previousPhase = state.phase;
      this.scene2RegatherTriggered = false;

      if (state.phase === "SCENE_1") {
        // Dissolve from QNTX into Scene 1's agents A and B (0.8s)
        const { cells: targets } = getScene1PaymentFrame(800, this.compressionK);
        this.particlePool.startDissolve(targets, CANVAS_CONFIG.timings.scene1Dissolve, 1111);
      } else if (state.phase === "SCENE_2") {
        // Dissolve from Scene 1 end into one centered agent (0.6s)
        const { cells: targets } = getScene2CrowdFrame(0, this.isMobile, this.compressionK);
        this.particlePool.startDissolve(targets, CANVAS_CONFIG.timings.scene2Dissolve, 2222);
      }
    }

    // Scene 2 end dissolve into QNTX wordmark at t=3200ms (0.8s)
    if (
      state.phase === "SCENE_2" &&
      state.elapsedInPhase >= 3200 &&
      !this.scene2RegatherTriggered
    ) {
      this.scene2RegatherTriggered = true;
      const { cells: targets } = getQntxFrame(0, false, this.compressionK);
      this.particlePool.startDissolve(targets, CANVAS_CONFIG.timings.scene2DissolveOut, 3333);
    }

    // Update particles based on active phase
    if (state.isTransitioning) {
      this.particlePool.updateDissolve(state.transitionProgress);
    } else {
      const targets = this.getTargetCellsForState(state);
      this.particlePool.setImmediateTargets(targets);
    }
  }

  private render(): void {
    const { width, height } = this.canvas;
    const cssW = width / this.dpr;
    const cssH = height / this.dpr;

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // Clean canvas background
    this.ctx.fillStyle = CANVAS_CONFIG.colors.bg;
    this.ctx.fillRect(0, 0, cssW, cssH);

    const cellStep = this.cellSize + this.gap;
    const realCenterCol = Math.floor(this.realCols / 2);
    const realCenterRow = Math.floor(this.realRows / 2);
    const stageRowOffset = realCenterRow - CANVAS_CONFIG.stage.centerRow; // 20

    const particles = this.particlePool.getParticles();

    for (const p of particles) {
      if (p.scale < 0.05) {
        continue;
      }

      // Project stage coordinate to real grid
      // col 64 maps to realCenterCol
      const realCol = realCenterCol + (p.col - CANVAS_CONFIG.stage.centerCol);
      const realRow = stageRowOffset + p.row;

      if (realCol < 0 || realCol >= this.realCols || realRow < 0 || realRow >= this.realRows) {
        continue;
      }

      const px = this.originX + realCol * cellStep;
      const py = this.originY + realRow * cellStep;
      const size = Math.max(1, Math.round(this.cellSize * p.scale));
      const offset = Math.floor((this.cellSize - size) / 2);

      const renderX = px + offset;
      const renderY = py + offset;

      if (p.state === "filled") {
        this.ctx.fillStyle = CANVAS_CONFIG.colors.fg;
        this.ctx.fillRect(renderX, renderY, size, size);
      } else if (p.state === "hollow") {
        this.ctx.fillStyle = CANVAS_CONFIG.colors.bg;
        this.ctx.fillRect(renderX, renderY, size, size);
        this.ctx.strokeStyle = CANVAS_CONFIG.colors.fg;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(renderX + 0.5, renderY + 0.5, size - 1, size - 1);
      }
    }
  }

  private updateReducedMotion(deltaMs: number): void {
    this.reducedMotionTimer += deltaMs;
    const interval = CANVAS_CONFIG.timings.reducedMotionInterval;

    if (this.reducedMotionTimer >= interval) {
      this.reducedMotionTimer = 0;
      this.reducedMotionFrame = this.reducedMotionFrame === "QNTX" ? "SCENE_1" : "QNTX";
    }

    const fadeDur = CANVAS_CONFIG.timings.reducedMotionFadeDuration;
    if (this.reducedMotionTimer < fadeDur) {
      this.reducedMotionOpacity = this.reducedMotionTimer / fadeDur;
    } else if (this.reducedMotionTimer > interval - fadeDur) {
      this.reducedMotionOpacity = (interval - this.reducedMotionTimer) / fadeDur;
    } else {
      this.reducedMotionOpacity = 1.0;
    }

    // Set canvas element opacity directly
    this.canvas.style.opacity = Math.max(0, Math.min(1, this.reducedMotionOpacity)).toString();
  }

  private renderReducedMotion(): void {
    const { width, height } = this.canvas;
    const cssW = width / this.dpr;
    const cssH = height / this.dpr;

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.ctx.fillStyle = CANVAS_CONFIG.colors.bg;
    this.ctx.fillRect(0, 0, cssW, cssH);

    const frameCells =
      this.reducedMotionFrame === "QNTX"
        ? getQntxFrame(0, false, this.compressionK).cells
        : getReducedMotionScene1Frame(this.compressionK).cells;

    const cellStep = this.cellSize + this.gap;
    const realCenterCol = Math.floor(this.realCols / 2);
    const realCenterRow = Math.floor(this.realRows / 2);
    const stageRowOffset = realCenterRow - CANVAS_CONFIG.stage.centerRow;

    this.ctx.fillStyle = CANVAS_CONFIG.colors.fg;

    for (const c of frameCells) {
      const realCol = realCenterCol + (c.col - CANVAS_CONFIG.stage.centerCol);
      const realRow = stageRowOffset + c.row;

      if (realCol < 0 || realCol >= this.realCols || realRow < 0 || realRow >= this.realRows) {
        continue;
      }

      const px = this.originX + realCol * cellStep;
      const py = this.originY + realRow * cellStep;
      this.ctx.fillRect(px, py, this.cellSize, this.cellSize);
    }
  }

  destroy(): void {
    if (this.rafId !== undefined) {
      cancelAnimationFrame(this.rafId);
    }
    if (this.resizeDebounceTimer !== undefined) {
      clearTimeout(this.resizeDebounceTimer);
    }

    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);

    if (this.intersectionObserver !== undefined) {
      this.intersectionObserver.disconnect();
    }
    if (this.resizeObserver !== undefined) {
      this.resizeObserver.disconnect();
    }
  }
}
