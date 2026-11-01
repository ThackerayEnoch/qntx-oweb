/**
 * QuantX Hero Canvas Engine
 *
 * Implements the fixed square grid, particle dissolve-and-regather morphing, mechanical
 * linear/uniform movement (whole-cell stepped), crisp integer pixel alignment, and reduced-motion
 * handling.
 */

import { CANVAS_CONFIG } from "./config";
import {
  getQntxFrame,
  getReducedMotionPayFrame,
  getScene1EarnFrame,
  getScene2PayFrame,
  getScene3ScaleFrame,
} from "./scenes";
import { CanvasTimeline, type TimelineState } from "./timeline";
import type { Particle, SceneFrame, SceneIndex, TargetCell } from "./types";

export class HeroCanvasEngine {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly timeline: CanvasTimeline;
  private particles: Particle[] = [];

  // Grid dimensions
  private cols = 96;
  private rows = 44;
  private cellSize = 8;
  private originX = 0;
  private originY = 0;
  private dpr = 1;

  // Animation Loop State
  private rafId: number | undefined = undefined;
  private lastTime = 0;
  private isVisible = true;
  private isReducedMotion = false;
  private reducedMotionTimer = 0;
  private reducedMotionFrame: "QNTX" | "PAY" = "QNTX";
  private reducedMotionOpacity = 1.0;

  // Observers & Listeners
  private intersectionObserver?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;
  private resizeDebounceTimer?: number;

  constructor(canvas: HTMLCanvasElement, onSceneChange?: (scene: SceneIndex) => void) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (context === null) {
      throw new Error("Failed to get 2D context from canvas");
    }
    this.ctx = context;

    this.timeline = new CanvasTimeline(onSceneChange, (flashing: boolean) => {
      this.handleButtonFlash(flashing);
    });

    this.checkReducedMotion();
    this.initGrid();
    this.initParticlePool();
    this.setupListeners();
    this.setupObservers();

    // Start with Intro QNTX
    const initialFrame = getQntxFrame(this.cols, this.rows, 0, true);
    this.setTargets(initialFrame.cells, false);

    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  getTimeline(): CanvasTimeline {
    return this.timeline;
  }

  private checkReducedMotion(): void {
    if (typeof window !== "undefined") {
      this.isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
  }

  private handleButtonFlash(flashing: boolean): void {
    const btn = document.getElementById(CANVAS_CONFIG.getStartedBtnId);
    if (btn !== null) {
      if (flashing) {
        btn.classList.add("bg-black", "text-white");
        btn.classList.remove("bg-white/80", "text-neutral-800");
      } else {
        btn.classList.remove("bg-black", "text-white");
        btn.classList.add("bg-white/80", "text-neutral-800");
      }
    }
  }

  private initGrid(): void {
    const rect = this.canvas.getBoundingClientRect();
    const cssW = Math.max(rect.width, 300);
    const cssH = Math.max(rect.height, 200);

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(cssW * this.dpr);
    this.canvas.height = Math.floor(cssH * this.dpr);

    // Responsive grid column/row limits
    const isMobile = cssW < CANVAS_CONFIG.mobile.breakpoint;
    this.cols = isMobile ? CANVAS_CONFIG.mobile.cols : CANVAS_CONFIG.desktop.cols;
    this.rows = isMobile ? CANVAS_CONFIG.mobile.rows : CANVAS_CONFIG.desktop.rows;

    const { gap } = CANVAS_CONFIG;
    const availableW = cssW - 16;
    const availableH = cssH - 16;

    // Compute maximum integer cell size that fits
    this.cellSize = Math.max(
      3,
      Math.floor(
        Math.min(
          (availableW - (this.cols - 1) * gap) / this.cols,
          (availableH - (this.rows - 1) * gap) / this.rows,
        ),
      ),
    );

    const gridW = this.cols * this.cellSize + (this.cols - 1) * gap;
    const gridH = this.rows * this.cellSize + (this.rows - 1) * gap;

    this.originX = Math.floor((cssW - gridW) / 2);
    this.originY = Math.floor((cssH - gridH) / 2);
  }

  private initParticlePool(): void {
    this.particles = [];
    const { poolSize } = CANVAS_CONFIG;

    for (let i = 0; i < poolSize; i++) {
      const col = Math.floor(Math.random() * this.cols);
      const row = Math.floor(Math.random() * this.rows);
      this.particles.push({
        col,
        row,
        fromCol: col,
        fromRow: row,
        targetCol: col,
        targetRow: row,
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

  private setupListeners(): void {
    // Window resize with debounce
    window.addEventListener("resize", this.handleResize);

    // Canvas Mouse Events: Pause timeline on hover, resume on leave
    this.canvas.addEventListener("mouseenter", () => {
      this.timeline.pause();
    });

    this.canvas.addEventListener("mouseleave", () => {
      this.timeline.resume();
    });

    // Keyboard navigation (ArrowLeft = prev, ArrowRight = next)
    window.addEventListener("keydown", this.handleKeyDown);

    // Tab visibility
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

  private readonly handleKeyDown = (e: KeyboardEvent): void => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      this.timeline.prevScene();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      this.timeline.nextScene();
    }
  };

  private readonly handleVisibilityChange = (): void => {
    if (document.hidden) {
      this.isVisible = false;
    } else {
      this.isVisible = true;
      this.lastTime = performance.now();
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

  /** Gets the target scene frame based on timeline state */
  private getFrameForState(state: TimelineState): SceneFrame {
    if (state.isIntro) {
      return getQntxFrame(this.cols, this.rows, state.elapsedInScene, true);
    }

    if (state.currentScene === 0) {
      return getScene1EarnFrame(this.cols, this.rows, state.elapsedInScene);
    }

    if (state.currentScene === 1) {
      return getScene2PayFrame(this.cols, this.rows, state.elapsedInScene);
    }

    // Scene 2: SCALE (4s) followed by QNTX hold (2s)
    if (state.elapsedInScene < CANVAS_CONFIG.timings.sceneScale) {
      return getScene3ScaleFrame(this.cols, this.rows, state.elapsedInScene);
    }

    const holdElapsed = state.elapsedInScene - CANVAS_CONFIG.timings.sceneScale;
    return getQntxFrame(this.cols, this.rows, holdElapsed, false);
  }

  /** Assigns targets to particles with random stagger delays for dissolve-and-regather */
  private setTargets(targets: ReadonlyArray<TargetCell>, isNewScene: boolean): void {
    const targetCount = targets.length;
    const poolSize = this.particles.length;

    for (let i = 0; i < poolSize; i++) {
      const p = this.particles[i];
      if (p === undefined) {
        continue;
      }

      if (i < targetCount) {
        const t = targets[i];
        if (t !== undefined) {
          p.fromCol = p.col;
          p.fromRow = p.row;
          p.fromScale = p.scale;
          p.targetCol = t.col;
          p.targetRow = t.row;
          p.targetState = t.state ?? "filled";
          p.targetScale = t.scale ?? 1.0;
          p.delay = isNewScene ? Math.random() * CANVAS_CONFIG.timings.maxStaggerDelay : 0;
          p.active = true;
        }
      } else {
        // Unused particle parks at scale 0
        p.fromCol = p.col;
        p.fromRow = p.row;
        p.fromScale = p.scale;
        p.targetScale = 0;
        p.delay = isNewScene ? Math.random() * (CANVAS_CONFIG.timings.maxStaggerDelay / 2) : 0;
        p.active = false;
      }
    }
  }

  private applyState(state: TimelineState, isNewScene = false): void {
    const frame = this.getFrameForState(state);
    this.setTargets(frame.cells, isNewScene);
  }

  private readonly tick = (timestamp: number): void => {
    const deltaMs = Math.min(100, timestamp - this.lastTime);
    this.lastTime = timestamp;

    if (this.isVisible) {
      if (this.isReducedMotion) {
        this.updateReducedMotion(deltaMs);
        this.renderReducedMotion();
      } else {
        this.update(deltaMs);
        this.render();
      }
    }

    this.rafId = requestAnimationFrame(this.tick);
  };

  private updateReducedMotion(deltaMs: number): void {
    this.reducedMotionTimer += deltaMs;
    const interval = CANVAS_CONFIG.timings.reducedMotionInterval;
    if (this.reducedMotionTimer >= interval) {
      this.reducedMotionTimer = 0;
      this.reducedMotionFrame = this.reducedMotionFrame === "QNTX" ? "PAY" : "QNTX";
    }

    // Crossfade opacity
    const fadeDuration = 600;
    if (this.reducedMotionTimer < fadeDuration) {
      this.reducedMotionOpacity = this.reducedMotionTimer / fadeDuration;
    } else if (this.reducedMotionTimer > interval - fadeDuration) {
      this.reducedMotionOpacity = (interval - this.reducedMotionTimer) / fadeDuration;
    } else {
      this.reducedMotionOpacity = 1.0;
    }
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
        ? getQntxFrame(this.cols, this.rows, 0, false).cells
        : getReducedMotionPayFrame(this.cols, this.rows).cells;

    this.ctx.globalAlpha = Math.max(0.1, Math.min(1, this.reducedMotionOpacity));
    this.ctx.fillStyle = CANVAS_CONFIG.colors.fg;

    const { gap } = CANVAS_CONFIG;
    for (const cell of frameCells) {
      const px = this.originX + cell.col * (this.cellSize + gap);
      const py = this.originY + cell.row * (this.cellSize + gap);
      this.ctx.fillRect(px, py, this.cellSize, this.cellSize);
    }

    this.ctx.globalAlpha = 1.0;
  }

  private update(deltaMs: number): void {
    const prevScene = this.timeline.getScene();
    const state = this.timeline.update(deltaMs);
    const isNewScene = prevScene !== state.currentScene;

    this.applyState(state, isNewScene);

    // Mechanical uniform movement: whole-cell step progression
    const transDuration = CANVAS_CONFIG.timings.transition;

    for (const p of this.particles) {
      if (!p.active && p.scale <= 0.01) {
        continue;
      }

      if (state.isTransitioning) {
        const transElapsed = state.transitionProgress * transDuration;
        if (transElapsed < p.delay) {
          // Stagger hold at origin
          p.col = p.fromCol;
          p.row = p.fromRow;
          p.scale = p.fromScale;
        } else {
          const effectiveDuration = Math.max(50, transDuration - p.delay);
          const t = Math.min(1, (transElapsed - p.delay) / effectiveDuration);

          // Strictly linear movement, rounded to whole cell integer
          p.col = Math.round(p.fromCol + (p.targetCol - p.fromCol) * t);
          p.row = Math.round(p.fromRow + (p.targetRow - p.fromRow) * t);
          p.scale = p.fromScale + (p.targetScale - p.fromScale) * t;

          if (t >= 0.5) {
            p.state = p.targetState;
          }
        }
      } else {
        // Holding / dynamic in-scene step: strictly snapped to targets
        p.col = p.targetCol;
        p.row = p.targetRow;
        p.scale = p.targetScale;
        p.state = p.targetState;
      }
    }
  }

  private render(): void {
    const { width, height } = this.canvas;
    const cssW = width / this.dpr;
    const cssH = height / this.dpr;

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // Clear with crisp background
    this.ctx.fillStyle = CANVAS_CONFIG.colors.bg;
    this.ctx.fillRect(0, 0, cssW, cssH);

    const { gap } = CANVAS_CONFIG;
    const { cellSize } = this;

    for (const p of this.particles) {
      if (p.scale < 0.05) {
        continue;
      }

      // Keep within grid boundaries
      if (p.col < 0 || p.col >= this.cols || p.row < 0 || p.row >= this.rows) {
        continue;
      }

      const px = this.originX + p.col * (cellSize + gap);
      const py = this.originY + p.row * (cellSize + gap);
      const size = Math.max(1, Math.round(cellSize * p.scale));
      const offset = Math.floor((cellSize - size) / 2);

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
      } else if (p.state === "inverted") {
        // Inverted flash: white cell with black outline for high-contrast punch
        this.ctx.fillStyle = CANVAS_CONFIG.colors.bg;
        this.ctx.fillRect(renderX, renderY, size, size);
        this.ctx.strokeStyle = CANVAS_CONFIG.colors.fg;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(renderX + 0.5, renderY + 0.5, size - 1, size - 1);
      }
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
    window.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);

    if (this.intersectionObserver !== undefined) {
      this.intersectionObserver.disconnect();
    }
    if (this.resizeObserver !== undefined) {
      this.resizeObserver.disconnect();
    }
  }
}
