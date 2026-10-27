/** QNTX Swarm Mesh Canvas Represents the decentralized Autonomous Agent Topology in ASCII / Squares */

import { type LookMode, LOOK_DEFS } from "./ascii-canvas";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  label: string;
  pulse: number;
};

const NODE_LABELS: ReadonlyArray<string> = [
  "agent_0x9a",
  "agent_0x14",
  "agent_0x7b",
  "agent_0x3e",
  "agent_0x82",
  "agent_0x0d",
  "agent_0x5c",
  "agent_0xf1",
];

export class SwarmCanvasEngine {
  private canvas: HTMLCanvasElement | undefined = undefined;
  private ctx: CanvasRenderingContext2D | undefined = undefined;
  private currentLook: LookMode = "squares";
  private nodes: Node[] = [];
  private dpr = 1;
  private rafId: number | undefined = undefined;
  private mouseX = -1000;
  private mouseY = -1000;

  constructor() {
    this.init();
  }

  private init(): void {
    if (typeof window === "undefined") {
      return;
    }

    const canvasEl = document.getElementById("qntx-swarm-canvas");
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
    this.createNodes();

    this.setupListeners();
    this.loop();
  }

  private setupListeners(): void {
    window.addEventListener("resize", () => {
      this.handleResize();
    });

    window.addEventListener("qntx:lookchange", (e: Event) => {
      if (e instanceof CustomEvent && typeof e.detail === "object" && e.detail !== null) {
        const rawLook: unknown = Reflect.get(e.detail, "look");
        if (
          rawLook === "squares" ||
          rawLook === "ascii" ||
          rawLook === "dots" ||
          rawLook === "blocks"
        ) {
          this.currentLook = rawLook;
        }
      }
    });

    if (this.canvas) {
      this.canvas.addEventListener("mousemove", (e: MouseEvent) => {
        if (!this.canvas) {
          return;
        }
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
      });

      this.canvas.addEventListener("mouseleave", () => {
        this.mouseX = -1000;
        this.mouseY = -1000;
      });

      this.canvas.addEventListener("click", (e: MouseEvent) => {
        if (!this.canvas) {
          return;
        }
        const rect = this.canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        this.nodes.forEach((n) => {
          const dist = Math.hypot(n.x - clickX, n.y - clickY);
          if (dist < 60) {
            n.pulse = 1.0;
          }
        });
      });
    }
  }

  private handleResize(): void {
    if (!this.canvas) {
      return;
    }
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(rect.width, 300);
    const height = Math.max(rect.height, 180);

    this.canvas.width = width * this.dpr;
    this.canvas.height = height * this.dpr;
  }

  private createNodes(): void {
    if (!this.canvas) {
      return;
    }
    const width = this.canvas.width / this.dpr;
    const height = this.canvas.height / this.dpr;
    const nodeCount = Math.min(8, Math.max(5, Math.floor(width / 110)));

    this.nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      const label = NODE_LABELS[i % NODE_LABELS.length] ?? "node";
      this.nodes.push({
        x: 40 + Math.random() * (width - 80),
        y: 30 + Math.random() * (height - 60),
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        label,
        pulse: Math.random(),
      });
    }
  }

  private loop(): void {
    this.update();
    this.render();
    this.rafId = requestAnimationFrame(() => this.loop());
  }

  private update(): void {
    if (!this.canvas) {
      return;
    }
    const width = this.canvas.width / this.dpr;
    const height = this.canvas.height / this.dpr;

    this.nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 30 || node.x > width - 30) {
        node.vx *= -1;
      }
      if (node.y < 20 || node.y > height - 20) {
        node.vy *= -1;
      }

      const dx = node.x - this.mouseX;
      const dy = node.y - this.mouseY;
      const dist = Math.hypot(dx, dy);
      if (dist < 70 && dist > 1) {
        node.x += (dx / dist) * 1.5;
        node.y += (dy / dist) * 1.5;
      }

      if (node.pulse > 0) {
        node.pulse = Math.max(0, node.pulse - 0.02);
      } else if (Math.random() > 0.985) {
        node.pulse = 1.0;
      }
    });
  }

  private render(): void {
    if (!this.ctx || !this.canvas) {
      return;
    }

    const { width, height } = this.canvas;
    const { ctx } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    const cssW = width / this.dpr;
    const cssH = height / this.dpr;

    ctx.clearRect(0, 0, cssW, cssH);

    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    for (let x = 16; x < cssW; x += 32) {
      for (let y = 16; y < cssH; y += 32) {
        ctx.fillRect(x, y, 1, 1);
      }
    }

    const maxLinkDist = 170;
    for (let i = 0; i < this.nodes.length; i++) {
      const a = this.nodes[i];
      if (a === undefined) {
        continue;
      }

      for (let j = i + 1; j < this.nodes.length; j++) {
        const b = this.nodes[j];
        if (b === undefined) {
          continue;
        }

        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < maxLinkDist) {
          const alpha = (1 - dist / maxLinkDist) * 0.25;
          ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
          ctx.setLineDash([3, 4]);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }

    const lookDef = LOOK_DEFS[this.currentLook] ?? LOOK_DEFS.squares;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    this.nodes.forEach((node) => {
      const activeSize = 6 + node.pulse * 6;

      if (this.currentLook === "squares") {
        ctx.fillStyle = node.pulse > 0.4 ? "#059669" : "#09090b";
        ctx.fillRect(
          Math.round(node.x - activeSize / 2),
          Math.round(node.y - activeSize / 2),
          Math.round(activeSize),
          Math.round(activeSize),
        );
      } else if (this.currentLook === "dots") {
        ctx.fillStyle = node.pulse > 0.4 ? "#059669" : "#09090b";
        ctx.beginPath();
        ctx.arc(node.x, node.y, activeSize / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = node.pulse > 0.4 ? "#059669" : "#09090b";
        ctx.font = '12px "GeistPixel-Square", ui-monospace, Menlo, monospace';
        const glyph = node.pulse > 0.4 ? "@" : (lookDef.ramp[lookDef.ramp.length - 2] ?? "■");
        ctx.fillText(glyph, node.x, node.y);
      }

      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.font = "10px ui-monospace, SF Mono, Menlo, monospace";
      ctx.fillText(node.label, node.x, node.y + 14);
    });
  }

  destroy(): void {
    if (this.rafId !== undefined) {
      cancelAnimationFrame(this.rafId);
    }
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    new SwarmCanvasEngine();
  });
}
