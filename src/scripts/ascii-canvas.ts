/**
 * QNTX Kinetic ASCII Canvas Engine Inspired by the Squares & ASCII architecture of
 * ascii-magic.com/ascii#library Features:
 *
 * - Real-time Halftone Squares (·▪■) & ASCII/Dots/Blocks rasterizer
 * - Kinetic Horizontal Unfolding of QNTX with particle trajectory interpolation
 * - Interactive gravitational mouse repulsion & cursor tracking
 * - Negative space floating aesthetic with zero outer borders
 */

export type LookMode = "squares" | "ascii" | "dots" | "blocks";

export type LookDef = {
  key: LookMode;
  label: string;
  glyph: string;
  ramp: ReadonlyArray<string>;
};

export const LOOK_DEFS: Record<LookMode, LookDef> = {
  squares: {
    key: "squares",
    label: "Squares",
    glyph: "·▪■",
    ramp: [" ", "·", "▪", "■"],
  },
  ascii: {
    key: "ascii",
    label: "ASCII",
    glyph: "*#$@",
    ramp: [" ", ".", ":", "-", "=", "+", "*", "#", "%", "@"],
  },
  dots: {
    key: "dots",
    label: "Halftone",
    glyph: "·•●",
    ramp: [" ", "·", "•", "●"],
  },
  blocks: {
    key: "blocks",
    label: "Blocks",
    glyph: "░▒▓█",
    ramp: [" ", "░", "▒", "▓", "█"],
  },
};

type Particle = {
  targetCol: number;
  targetRow: number;
  originCol: number;
  originRow: number;
  currentCol: number;
  currentRow: number;
  vx: number;
  vy: number;
  intensity: number;
  delay: number;
};

// 7x9 bitmap glyphs for Q, N, T, X
const GLYPH_MAP: Record<string, ReadonlyArray<string>> = {
  Q: [
    " 11111 ",
    "11   11",
    "11   11",
    "11   11",
    "11   11",
    "11 1 11",
    " 11111 ",
    "    11 ",
    "     11",
  ],
  N: [
    "11   11",
    "111  11",
    "1111 11",
    "11 1111",
    "11  111",
    "11   11",
    "11   11",
    "11   11",
    "11   11",
  ],
  T: [
    "1111111",
    "1111111",
    "  111  ",
    "  111  ",
    "  111  ",
    "  111  ",
    "  111  ",
    "  111  ",
    "  111  ",
  ],
  X: [
    "11   11",
    " 11 11 ",
    "  111  ",
    "   1   ",
    "  111  ",
    " 11 11 ",
    "11   11",
    "11   11",
    "11   11",
  ],
};

export class AsciiCanvasEngine {
  private canvas: HTMLCanvasElement | undefined = undefined;
  private ctx: CanvasRenderingContext2D | undefined = undefined;
  private readonly currentLook: LookMode = "squares";
  private particles: Particle[] = [];
  private cols = 64;
  private rows = 24;
  private cellW = 14;
  private cellH = 18;
  private dpr = 1;
  private unfoldProgress = 1.0;
  private isAutoPlaying = true;
  private animStartTime = 0;
  private readonly animDuration = 1800;
  private rafId: number | undefined = undefined;
  private mouseX = -1000;
  private mouseY = -1000;
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
    this.generateParticles();

    this.setupListeners();
    this.startUnfoldAnimation();
    this.loop(performance.now());
  }

  private setupListeners(): void {
    window.addEventListener("resize", () => {
      this.handleResize();
      this.generateParticles();
    });

    if (this.canvas) {
      this.canvas.addEventListener("mousemove", (e: MouseEvent) => {
        if (!this.canvas) {
          return;
        }
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = (e.clientX - rect.left) / this.cellW;
        this.mouseY = (e.clientY - rect.top) / this.cellH;
        this.isMouseOver = true;
      });

      this.canvas.addEventListener("mouseleave", () => {
        this.isMouseOver = false;
        this.mouseX = -1000;
        this.mouseY = -1000;
      });

      this.canvas.addEventListener("click", () => {
        this.startUnfoldAnimation();
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

  private handleResize(): void {
    if (!this.canvas) {
      return;
    }
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(rect.width, 320);
    const height = Math.max(rect.height, 260);

    this.canvas.width = width * this.dpr;
    this.canvas.height = height * this.dpr;

    if (width < 640) {
      this.cols = 48;
      this.rows = 20;
    } else if (width < 1024) {
      this.cols = 64;
      this.rows = 22;
    } else {
      this.cols = 76;
      this.rows = 24;
    }

    this.cellW = width / this.cols;
    this.cellH = height / this.rows;
  }

  private generateParticles(): void {
    this.particles = [];
    const letters = ["Q", "N", "T", "X"];
    const glyphW = 7;
    const glyphH = 9;
    const letterGap = Math.max(2, Math.floor(this.cols / 24));
    const totalLetterWidth = letters.length * glyphW + (letters.length - 1) * letterGap;

    const startX = Math.floor((this.cols - totalLetterWidth) / 2);
    const startY = Math.floor((this.rows - glyphH) / 2);
    const centerCol = this.cols / 2;
    const centerRow = this.rows / 2;

    letters.forEach((char, letterIdx) => {
      const glyph = GLYPH_MAP[char];
      if (glyph === undefined) {
        return;
      }

      const letterOffsetCol = startX + letterIdx * (glyphW + letterGap);

      for (let r = 0; r < glyph.length; r++) {
        const rowStr = glyph[r];
        if (rowStr === undefined) {
          continue;
        }

        for (let c = 0; c < rowStr.length; c++) {
          if (rowStr[c] === "1") {
            const targetCol = letterOffsetCol + c;
            const targetRow = startY + r;

            const angle = Math.random() * Math.PI * 2;
            const radius = 1.5 + Math.random() * 3.5;
            const originCol = centerCol + Math.cos(angle) * radius;
            const originRow = centerRow + Math.sin(angle) * radius;

            const distFromCenter = Math.abs(targetCol - centerCol) / centerCol;
            const delay = distFromCenter * 0.45;

            this.particles.push({
              targetCol,
              targetRow,
              originCol,
              originRow,
              currentCol: originCol,
              currentRow: originRow,
              vx: 0,
              vy: 0,
              intensity: 0.95 + Math.random() * 0.05,
              delay,
            });
          }
        }
      }
    });
  }

  startUnfoldAnimation(): void {
    this.isAutoPlaying = true;
    this.unfoldProgress = 0.0;
    this.animStartTime = performance.now();
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

    for (const p of this.particles) {
      const particleProgress = Math.max(
        0,
        Math.min(1, (this.unfoldProgress - p.delay) / (1 - p.delay)),
      );
      const easeP = 1 - (1 - particleProgress) ** 3;

      const baseX = p.originCol + (p.targetCol - p.originCol) * easeP;
      const baseY = p.originRow + (p.targetRow - p.originRow) * easeP;

      const wave = Math.sin(now * 0.002 + p.targetCol * 0.25) * 0.15 * easeP;

      let mouseDispX = 0;
      let mouseDispY = 0;
      if (this.isMouseOver) {
        const dx = p.currentCol - this.mouseX;
        const dy = p.currentRow - this.mouseY;
        const dist = Math.hypot(dx, dy);
        const radius = 6.0;
        if (dist < radius && dist > 0.01) {
          const force = (1 - dist / radius) * 2.8;
          mouseDispX = (dx / dist) * force;
          mouseDispY = (dy / dist) * force;
        }
      }

      const destX = baseX + mouseDispX;
      const destY = baseY + wave + mouseDispY;

      p.vx = (destX - p.currentCol) * 0.22;
      p.vy = (destY - p.currentRow) * 0.22;
      p.currentCol += p.vx;
      p.currentRow += p.vy;
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

    const lookDef = LOOK_DEFS[this.currentLook] ?? LOOK_DEFS.squares;

    ctx.fillStyle = "#09090b";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `600 ${Math.max(10, Math.round(this.cellH * 0.82))}px "GeistPixel-Square", ui-monospace, Menlo, Consolas, monospace`;

    for (const p of this.particles) {
      const px = p.currentCol * this.cellW;
      const py = p.currentRow * this.cellH;

      if (px < -20 || px > canvasCssW + 20 || py < -20 || py > canvasCssH + 20) {
        continue;
      }

      if (this.currentLook === "squares") {
        const maxSquareSize = Math.min(this.cellW, this.cellH) * 0.88;
        const squareSize = Math.max(2, Math.round(maxSquareSize * p.intensity));
        ctx.fillRect(
          Math.round(px - squareSize / 2),
          Math.round(py - squareSize / 2),
          squareSize,
          squareSize,
        );
      } else if (this.currentLook === "dots") {
        const radius = Math.max(1.5, Math.min(this.cellW, this.cellH) * 0.44 * p.intensity);
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const glyphIdx = Math.min(
          lookDef.ramp.length - 1,
          Math.floor(p.intensity * (lookDef.ramp.length - 1)),
        );
        const char = lookDef.ramp[glyphIdx] ?? "■";
        ctx.fillText(char, px, py);
      }
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
