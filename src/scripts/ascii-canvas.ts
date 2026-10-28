/**
 * QuantX ASCII Squares Interactive Canvas Engine
 *
 * Inspired by ascii-magic.com/ascii Squares component architecture. Features:
 *
 * - High-fidelity typographic density matrix directly sampled from public/qntx.png
 * - Real-time ASCII Magic halftone squares rasterizer (cell darkness -> square size)
 * - Kinetic horizontal unfolding crystallization sequence
 * - Interactive gravitational mouse repulsion & tactile surface elasticity
 * - Shockwave ripple pulses on click / tap
 * - Ambient kinetic wave propagation
 * - Full responsive touch & retina display support
 */

import { QNTX_COLS, QNTX_ROWS, QNTX_SQUARES } from "./qntx-data";

type SquareParticle = {
  readonly col: number;
  readonly row: number;
  readonly density: number;
  baseX: number;
  baseY: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  scale: number;
  vScale: number;
  readonly delay: number;
};

type Shockwave = {
  originX: number;
  originY: number;
  startTime: number;
  maxRadius: number;
  speed: number;
};

export class AsciiCanvasEngine {
  private canvas: HTMLCanvasElement | undefined = undefined;
  private ctx: CanvasRenderingContext2D | undefined = undefined;
  private squares: SquareParticle[] = [];
  private shockwaves: Shockwave[] = [];
  private dpr = 1;
  private cellUnit = 10;
  private unfoldProgress = 1.0;
  private isAutoPlaying = true;
  private animStartTime = 0;
  private readonly animDuration = 1600;
  private rafId: number | undefined = undefined;
  private mouseX = -2000;
  private mouseY = -2000;
  private isMouseOver = false;

  constructor() {
    this.init();
  }

  private init(): void {
    if (typeof window === "undefined") {
      return;
    }

    const canvasEl = document.getElementById("qntx-ascii-canvas");
    if (!(canvasEl instanceof HTMLCanvasElement)) {
      return;
    }

    this.canvas = canvasEl;
    const context = canvasEl.getContext("2d");
    if (!context) {
      return;
    }
    this.ctx = context;

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.handleResize();
    this.setupListeners();
    this.startUnfoldAnimation();
    this.loop(performance.now());
  }

  private setupListeners(): void {
    window.addEventListener("resize", () => {
      this.handleResize();
    });

    if (this.canvas) {
      this.canvas.addEventListener("mousemove", (e: MouseEvent) => {
        if (!this.canvas) {
          return;
        }
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
        this.isMouseOver = true;
      });

      this.canvas.addEventListener("mouseleave", () => {
        this.isMouseOver = false;
        this.mouseX = -2000;
        this.mouseY = -2000;
      });

      this.canvas.addEventListener("click", (e: MouseEvent) => {
        if (!this.canvas) {
          return;
        }
        const rect = this.canvas.getBoundingClientRect();
        this.addShockwave(e.clientX - rect.left, e.clientY - rect.top);
      });

      // Mobile Touch Support
      this.canvas.addEventListener(
        "touchstart",
        (e: TouchEvent) => {
          if (!this.canvas) {
            return;
          }
          const [touch] = e.touches;
          if (touch === undefined) {
            return;
          }
          const rect = this.canvas.getBoundingClientRect();
          this.mouseX = touch.clientX - rect.left;
          this.mouseY = touch.clientY - rect.top;
          this.isMouseOver = true;
          this.addShockwave(this.mouseX, this.mouseY);
        },
        { passive: true },
      );

      this.canvas.addEventListener(
        "touchmove",
        (e: TouchEvent) => {
          if (!this.canvas) {
            return;
          }
          const [touch] = e.touches;
          if (touch === undefined) {
            return;
          }
          const rect = this.canvas.getBoundingClientRect();
          this.mouseX = touch.clientX - rect.left;
          this.mouseY = touch.clientY - rect.top;
          this.isMouseOver = true;
        },
        { passive: true },
      );

      this.canvas.addEventListener("touchend", () => {
        this.isMouseOver = false;
        this.mouseX = -2000;
        this.mouseY = -2000;
      });
    }

    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === " " || e.key.toLowerCase() === "r") {
        e.preventDefault();
        this.startUnfoldAnimation();
      }
    });
  }

  private addShockwave(originX: number, originY: number): void {
    this.shockwaves.push({
      originX,
      originY,
      startTime: performance.now(),
      maxRadius: 750,
      speed: 0.65,
    });
    if (this.shockwaves.length > 5) {
      this.shockwaves.shift();
    }
  }

  private handleResize(): void {
    if (!this.canvas) {
      return;
    }
    const rect = this.canvas.getBoundingClientRect();
    const cssW = Math.max(rect.width, 300);
    const cssH = Math.max(rect.height, 200);

    this.canvas.width = cssW * this.dpr;
    this.canvas.height = cssH * this.dpr;

    // Calculate grid unit to fit 84 cols x 18 rows
    const hPadding = cssW < 640 ? 16 : 32;
    const vPadding = 20;
    const availableW = cssW - hPadding * 2;
    const availableH = cssH - vPadding * 2;

    this.cellUnit = Math.min(availableW / QNTX_COLS, availableH / QNTX_ROWS);
    const gridW = QNTX_COLS * this.cellUnit;
    const gridH = QNTX_ROWS * this.cellUnit;
    const startX = (cssW - gridW) / 2;
    const startY = (cssH - gridH) / 2;

    if (this.squares.length === 0) {
      this.squares = QNTX_SQUARES.map(([col, row, density]) => {
        const baseX = startX + (col + 0.5) * this.cellUnit;
        const baseY = startY + (row + 0.5) * this.cellUnit;
        const delay = (col / QNTX_COLS) * 0.55;
        return {
          col,
          row,
          density,
          baseX,
          baseY,
          currentX: baseX,
          currentY: baseY,
          vx: 0,
          vy: 0,
          scale: 0,
          vScale: 0,
          delay,
        };
      });
    } else {
      this.squares.forEach((sq) => {
        sq.baseX = startX + (sq.col + 0.5) * this.cellUnit;
        sq.baseY = startY + (sq.row + 0.5) * this.cellUnit;
      });
    }
  }

  startUnfoldAnimation(): void {
    this.isAutoPlaying = true;
    this.unfoldProgress = 0.0;
    this.animStartTime = performance.now();
    this.squares.forEach((sq) => {
      sq.scale = 0;
      sq.vScale = 0;
    });
  }

  private loop(timestamp: number): void {
    this.update(timestamp);
    this.render();
    this.rafId = requestAnimationFrame((t) => this.loop(t));
  }

  private update(now: number): void {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      this.unfoldProgress = 1.0;
      this.isAutoPlaying = false;
    } else if (this.isAutoPlaying) {
      const elapsed = now - this.animStartTime;
      const t = Math.min(1, elapsed / this.animDuration);
      this.unfoldProgress = t === 1 ? 1 : 1 - (1 - t) ** 3;
      if (t >= 1) {
        this.isAutoPlaying = false;
      }
    }

    // Filter finished shockwaves
    this.shockwaves = this.shockwaves.filter(
      (sw) => (now - sw.startTime) * sw.speed < sw.maxRadius,
    );

    const mouseRadius = 88;
    const maxRepel = 24;

    for (const sq of this.squares) {
      // 1. Unfold progress for this square
      let unfoldScale = 1.0;
      if (!prefersReducedMotion) {
        const sqP = Math.max(0, Math.min(1, (this.unfoldProgress - sq.delay) / 0.45));
        unfoldScale = sqP === 1 ? 1 : 1 - (1 - sqP) ** 3;
      }

      // 2. Ambient kinetic micro-wave
      let ambientY = 0;
      let ambientScale = 1.0;
      if (!prefersReducedMotion) {
        ambientY = Math.sin(now * 0.0022 + sq.col * 0.18 + sq.row * 0.12) * 0.85;
        ambientScale = 1.0 + Math.sin(now * 0.0018 + sq.col * 0.15) * 0.035;
      }

      // 3. Mouse repulsion & proximity swell
      let repelX = 0;
      let repelY = 0;
      let mouseScale = 1.0;

      if (this.isMouseOver) {
        const dx = sq.currentX - this.mouseX;
        const dy = sq.currentY - this.mouseY;
        const dist = Math.hypot(dx, dy);

        if (dist < mouseRadius && dist > 0.01) {
          const force = (1 - dist / mouseRadius) ** 2 * maxRepel;
          repelX = (dx / dist) * force;
          repelY = (dy / dist) * force;
          mouseScale = 1.0 + (1 - dist / mouseRadius) * 0.28;
        }
      }

      // 4. Shockwave ripples
      let waveX = 0;
      let waveY = 0;
      let waveScale = 1.0;

      for (const sw of this.shockwaves) {
        const elapsed = (now - sw.startTime) * sw.speed;
        const dist = Math.hypot(sq.baseX - sw.originX, sq.baseY - sw.originY);
        const waveDiff = Math.abs(dist - elapsed);
        const waveThickness = 48;

        if (waveDiff < waveThickness) {
          const falloff = Math.max(0, 1 - dist / sw.maxRadius);
          const strength = (1 - waveDiff / waveThickness) ** 2 * falloff;
          const normDist = Math.max(dist, 1);
          waveX += ((sq.baseX - sw.originX) / normDist) * strength * 16;
          waveY += ((sq.baseY - sw.originY) / normDist) * strength * 16;
          waveScale += strength * 0.35;
        }
      }

      // Spring physics towards target
      const targetX = sq.baseX + repelX + waveX;
      const targetY = sq.baseY + ambientY + repelY + waveY;
      const targetScale = unfoldScale * ambientScale * mouseScale * waveScale;

      sq.vx = (sq.vx + (targetX - sq.currentX) * 0.18) * 0.72;
      sq.vy = (sq.vy + (targetY - sq.currentY) * 0.18) * 0.72;
      sq.currentX += sq.vx;
      sq.currentY += sq.vy;

      sq.vScale = (sq.vScale + (targetScale - sq.scale) * 0.22) * 0.76;
      sq.scale += sq.vScale;
    }
  }

  private render(): void {
    if (!this.ctx || !this.canvas) {
      return;
    }
    const { width, height } = this.canvas;
    const { ctx } = this;

    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const canvasCssW = width / this.dpr;
    const canvasCssH = height / this.dpr;

    ctx.clearRect(0, 0, canvasCssW, canvasCssH);

    // ASCII Magic squares halftone algorithm:
    // Cell darkness determines the size of the square:
    // baseSize = cellUnit * 0.88 * (minDot + (1 - minDot) * density)
    const minDot = 0.24;
    const maxSquareRatio = 0.88;
    ctx.fillStyle = "#09090b";

    for (const sq of this.squares) {
      if (sq.scale < 0.01) {
        continue;
      }

      const baseSize = this.cellUnit * maxSquareRatio * (minDot + (1 - minDot) * sq.density);
      const size = Math.max(1, baseSize * sq.scale);

      ctx.fillRect(
        Math.round(sq.currentX - size / 2),
        Math.round(sq.currentY - size / 2),
        Math.round(size),
        Math.round(size),
      );
    }
  }

  destroy(): void {
    if (this.rafId !== undefined) {
      cancelAnimationFrame(this.rafId);
    }
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    new AsciiCanvasEngine();
  });
}
