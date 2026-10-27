/**
 * QNTX ASCII Engine Designed in the spirit of ascii-magic.com/ascii#library Features:
 *
 * - Multi-look character styling (Squares, ASCII, Dots, Blocks, Binary, Lines)
 * - Horizontal QNTX ASCII unfolding animation with interactive scrubbing & auto-play
 * - Real-time LiveData telemetry stream & ASCII waveform visualizer
 * - Real-time Swarm ASCII Node Grid
 * - Keyboard page navigation ([1], [2], [L])
 */

export type LookConfig = {
  key: string;
  label: string;
  sample: string;
  solid: string;
  mid: string;
  light: string;
  faint: string;
  empty: string;
};

export const LOOKS: Record<string, LookConfig> = {
  squares: {
    key: "squares",
    label: "Squares",
    sample: "·▪■",
    solid: "■",
    mid: "▪",
    light: "▫",
    faint: "·",
    empty: " ",
  },
  ascii: {
    key: "ascii",
    label: "ASCII",
    sample: "*#$@",
    solid: "@",
    mid: "#",
    light: "*",
    faint: ".",
    empty: " ",
  },
  dots: {
    key: "dots",
    label: "Halftone",
    sample: "·•●",
    solid: "●",
    mid: "•",
    light: "·",
    faint: " ",
    empty: " ",
  },
  blocks: {
    key: "blocks",
    label: "Blocks",
    sample: "░▒▓█",
    solid: "█",
    mid: "▓",
    light: "▒",
    faint: "░",
    empty: " ",
  },
  binary: {
    key: "binary",
    label: "Binary",
    sample: "01",
    solid: "1",
    mid: "1",
    light: "0",
    faint: "0",
    empty: " ",
  },
  lines: {
    key: "lines",
    label: "Lines",
    sample: "╌─━═",
    solid: "═",
    mid: "━",
    light: "─",
    faint: "╌",
    empty: " ",
  },
};

const QNTX_ASCII_ROWS: ReadonlyArray<string> = [
  "  ▄████▄   ███    ██ ████████ ██   ██ ",
  " ██    ██  ████   ██    ██     ██ ██  ",
  " ██    ██  ██ ██  ██    ██      ███   ",
  " ██ ▄▄ ██  ██  ██ ██    ██     ██ ██  ",
  "  ▀████▀   ██   ████    ██    ██   ██ ",
  "       ▀▀                             ",
];

const AGENT_NODES: ReadonlyArray<string> = [
  "agent:0x9A",
  "agent:0x14",
  "agent:0x7B",
  "agent:0x3E",
  "agent:0x82",
  "agent:0x0D",
  "agent:0x5C",
  "agent:0xF1",
];

const PROTOCOL_OPS: ReadonlyArray<string> = [
  "mesh::discover",
  "pulse::telemetry",
  "core::dispatch",
  "vault::verify",
  "state::consensus",
  "stream::pipe",
];

type TxRecord = {
  time: string;
  agent: string;
  op: string;
  ms: string;
};

export class AsciiEngine {
  private currentLook = "squares";
  private unfoldProgress = 1.0;
  private isUnfolding = false;
  private unfoldRaf: number | undefined = undefined;
  private tps = 3420;
  private latency = 4.2;
  private agentCount = 14820;
  private readonly waveHistory: number[] = Array.from({ length: 32 }, (_, i) =>
    Math.round(10 + Math.sin(i * 0.4) * 6),
  );
  private readonly txLog: TxRecord[] = [];
  private readonly swarmCols = 24;
  private readonly swarmRows = 6;
  private swarmState: number[][] = [];

  constructor() {
    this.init();
  }

  private init(): void {
    if (typeof window === "undefined") {
      return;
    }

    this.initSwarmGrid();
    this.initLookSwitcher();
    this.initUnfoldAnimation();
    this.initLiveData();
    this.initCopyButton();
    this.initScrollAndNav();
    this.initLetterHoverGlitch();

    setTimeout(() => {
      this.playUnfold();
    }, 200);
  }

  /* ──────────────── Look Management ──────────────── */

  setLook(lookKey: string): void {
    const selected = LOOKS[lookKey];
    if (selected === undefined) {
      return;
    }
    this.currentLook = lookKey;

    document.querySelectorAll("[data-look-btn]").forEach((btn) => {
      const active = btn.getAttribute("data-look-btn") === lookKey;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    this.renderAsciiBanner();
    this.renderWaveform();
    this.renderTxLog();
    this.renderSwarmGrid();
  }

  cycleLook(): void {
    const keys = Object.keys(LOOKS);
    const nextIdx = (keys.indexOf(this.currentLook) + 1) % keys.length;
    const nextKey = keys[nextIdx];
    if (typeof nextKey === "string") {
      this.setLook(nextKey);
    }
  }

  private initLookSwitcher(): void {
    document.querySelectorAll("[data-look-btn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lookKey = btn.getAttribute("data-look-btn");
        if (typeof lookKey === "string" && lookKey.length > 0) {
          this.setLook(lookKey);
        }
      });
    });
  }

  /* ──────────── Horizontal Unfolding Animation ──────────── */

  private renderAsciiBanner(): void {
    const el = document.getElementById("ascii-unfold-display");
    if (!el) {
      return;
    }

    const look = LOOKS[this.currentLook] ?? LOOKS.squares;
    const [firstRow] = QNTX_ASCII_ROWS;
    if (!firstRow) {
      return;
    }

    const totalCols = firstRow.length;
    const progress = Math.max(0, Math.min(1, this.unfoldProgress));

    const activeCols = Math.round(totalCols * progress);
    const startCol = Math.floor((totalCols - activeCols) / 2);
    const endCol = startCol + activeCols;

    const lines = QNTX_ASCII_ROWS.map((row) => {
      let line = "";
      for (let c = 0; c < totalCols; c++) {
        if (c < startCol || c >= endCol) {
          line += " ";
          continue;
        }

        const ch = row[c] ?? " ";
        if (ch === "█") {
          line += look.solid;
        } else if (ch === "▄" || ch === "▀") {
          line += look.mid;
        } else if (ch === "░" || ch === "▒") {
          line += look.light;
        } else if (ch === " ") {
          line += " ";
        } else {
          line += ch;
        }
      }
      return line;
    });

    const borderCh = look.light;
    const midCh = look.mid;
    const trackPad = Math.max(0, Math.floor((totalCols - activeCols) / 2));
    const trackWidth = Math.max(2, activeCols);
    const innerWidth = Math.max(0, trackWidth - 2);
    const spaces = " ".repeat(trackPad);
    const frameTrack = `${spaces}┌${midCh.repeat(innerWidth)}┐`;
    const bottomTrack = `${spaces}└${borderCh.repeat(innerWidth)}┘`;

    el.textContent = `${frameTrack}\n${lines.join("\n")}\n${bottomTrack}`;

    const pctEl = document.getElementById("unfold-pct");
    if (pctEl) {
      pctEl.textContent = `${Math.round(progress * 100)}%`;
    }

    const slider = document.getElementById("unfold-slider");
    if (slider instanceof HTMLInputElement && !this.isUnfolding) {
      slider.value = String(Math.round(progress * 100));
    }
  }

  playUnfold(): void {
    if (this.isUnfolding && this.unfoldRaf !== undefined) {
      cancelAnimationFrame(this.unfoldRaf);
    }
    this.isUnfolding = true;
    this.unfoldProgress = 0.05;

    const startTime = performance.now();
    const duration = 1200;

    const step = (now: number): void => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      this.unfoldProgress = 1 - (1 - t) ** 3;
      this.renderAsciiBanner();

      if (t < 1) {
        this.unfoldRaf = requestAnimationFrame(step);
      } else {
        this.unfoldProgress = 1.0;
        this.isUnfolding = false;
        this.renderAsciiBanner();
      }
    };

    this.unfoldRaf = requestAnimationFrame(step);
  }

  private initUnfoldAnimation(): void {
    const replayBtn = document.getElementById("unfold-replay-btn");
    if (replayBtn) {
      replayBtn.addEventListener("click", () => {
        this.playUnfold();
      });
    }

    const slider = document.getElementById("unfold-slider");
    if (slider instanceof HTMLInputElement) {
      slider.addEventListener("input", (e) => {
        if (this.isUnfolding && this.unfoldRaf !== undefined) {
          cancelAnimationFrame(this.unfoldRaf);
          this.isUnfolding = false;
        }
        if (e.target instanceof HTMLInputElement) {
          const val = Number.parseFloat(e.target.value) / 100;
          this.unfoldProgress = val;
          this.renderAsciiBanner();
        }
      });
    }
  }

  private initLetterHoverGlitch(): void {
    const display = document.getElementById("ascii-unfold-display");
    if (!display) {
      return;
    }

    display.addEventListener("mousemove", () => {
      if (Math.random() > 0.7 && !this.isUnfolding && this.unfoldProgress >= 0.95) {
        this.renderAsciiBanner();
      }
    });
  }

  /* ──────────────── LiveData Telemetry ──────────────── */

  private initLiveData(): void {
    for (let i = 0; i < 4; i++) {
      this.addRandomTx();
    }
    this.renderTxLog();
    this.renderWaveform();

    setInterval(() => {
      this.tick();
    }, 850);
  }

  private addRandomTx(): void {
    const now = new Date();
    const timeParts = now.toTimeString().split(" ");
    const timeStr = timeParts[0] ?? "00:00:00";
    const msStr = String(now.getMilliseconds()).padStart(3, "0");
    const time = `${timeStr}.${msStr}`;

    const agent = AGENT_NODES[Math.floor(Math.random() * AGENT_NODES.length)] ?? "agent:0x00";
    const op = PROTOCOL_OPS[Math.floor(Math.random() * PROTOCOL_OPS.length)] ?? "core::dispatch";
    const ms = (2.1 + Math.random() * 4.8).toFixed(1);

    this.txLog.unshift({ time, agent, op, ms });
    if (this.txLog.length > 4) {
      this.txLog.pop();
    }

    this.tps = Math.floor(3380 + Math.random() * 120);
    this.latency = Number.parseFloat((3.8 + Math.random() * 0.9).toFixed(1));
    this.agentCount += Math.floor(Math.random() * 3);

    const prev = this.waveHistory[this.waveHistory.length - 1] ?? 10;
    const delta = (Math.random() - 0.48) * 5;
    const nextVal = Math.max(2, Math.min(18, Math.round(prev + delta)));
    this.waveHistory.push(nextVal);
    this.waveHistory.shift();

    this.stepSwarmGrid();
  }

  private tick(): void {
    this.addRandomTx();
    this.renderTxLog();
    this.renderWaveform();
    this.renderSwarmGrid();
    this.updateStats();
  }

  private updateStats(): void {
    const tpsEl = document.getElementById("stat-tps");
    const latEl = document.getElementById("stat-latency");
    const agentEl = document.getElementById("stat-agents");

    if (tpsEl) {
      tpsEl.textContent = this.tps.toLocaleString();
    }
    if (latEl) {
      latEl.textContent = `${this.latency}ms`;
    }
    if (agentEl) {
      agentEl.textContent = this.agentCount.toLocaleString();
    }
  }

  private renderTxLog(): void {
    const container = document.getElementById("live-tx-feed");
    if (!container) {
      return;
    }

    const look = LOOKS[this.currentLook] ?? LOOKS.squares;

    const lines = this.txLog.map((tx, idx) => {
      const isNew = idx === 0;
      const marker = isNew ? look.solid : look.mid;
      const statusClass = isNew ? "text-neutral-950 font-medium" : "text-neutral-500";
      const markerClass = isNew ? "text-emerald-600" : "text-neutral-400";
      const agentClass = isNew ? "text-neutral-900" : "text-neutral-600";

      return `<div class="truncate ${statusClass} font-mono text-[11px] leading-relaxed flex items-center gap-2">
        <span class="${markerClass} select-none">${marker}</span>
        <span class="text-neutral-400">[${tx.time}]</span>
        <span class="${agentClass}">${tx.agent}</span>
        <span class="text-neutral-300">─►</span>
        <span class="text-neutral-700">${tx.op}</span>
        <span class="text-emerald-600 font-medium">OK</span>
        <span class="text-neutral-400">${tx.ms}ms</span>
      </div>`;
    });

    container.innerHTML = lines.join("");
  }

  private renderWaveform(): void {
    const el = document.getElementById("ascii-waveform");
    if (!el) {
      return;
    }

    const look = LOOKS[this.currentLook] ?? LOOKS.squares;
    const height = 4;
    const maxVal = 20;
    const cols = this.waveHistory.length;
    const grid: string[][] = Array.from({ length: height }, () =>
      Array.from({ length: cols }, () => " "),
    );

    for (let c = 0; c < cols; c++) {
      const val = this.waveHistory[c] ?? 0;
      const normalizedRow = Math.min(height - 1, Math.floor((val / maxVal) * height));
      for (let r = 0; r < height; r++) {
        const visualRow = height - 1 - r;
        const rowArr = grid[visualRow];
        if (rowArr !== undefined) {
          if (r < normalizedRow) {
            rowArr[c] = look.faint;
          } else if (r === normalizedRow) {
            rowArr[c] = look.solid;
          } else {
            rowArr[c] = " ";
          }
        }
      }
    }

    const asciiChart = grid.map((row) => row.join("")).join("\n");
    el.textContent = asciiChart;
  }

  /* ─────────────── Swarm Node Matrix ─────────────── */

  private initSwarmGrid(): void {
    this.swarmState = [];
    for (let r = 0; r < this.swarmRows; r++) {
      const row: number[] = [];
      for (let c = 0; c < this.swarmCols; c++) {
        row.push(Math.random() > 0.75 ? 2 : Math.random() > 0.4 ? 1 : 0);
      }
      this.swarmState.push(row);
    }
  }

  private stepSwarmGrid(): void {
    if (this.swarmState.length === 0) {
      return;
    }
    for (let r = 0; r < this.swarmRows; r++) {
      const row = this.swarmState[r];
      if (row === undefined) {
        continue;
      }
      for (let c = 0; c < this.swarmCols; c++) {
        if (Math.random() > 0.85) {
          const current = row[c] ?? 0;
          row[c] = (current + 1) % 3;
        }
      }
    }
  }

  private renderSwarmGrid(): void {
    const el = document.getElementById("ascii-swarm-grid");
    if (!el || this.swarmState.length === 0) {
      return;
    }

    const look = LOOKS[this.currentLook] ?? LOOKS.squares;
    const lines = this.swarmState.map((row) =>
      row
        .map((val) => {
          if (val === 2) {
            return look.solid;
          }
          if (val === 1) {
            return look.mid;
          }
          return look.faint;
        })
        .join(" "),
    );

    el.textContent = lines.join("\n");
  }

  /* ───────────── Keyboard & Scroll Navigation ───────────── */

  private initCopyButton(): void {
    const copyBtn = document.getElementById("copy-cmd-btn");
    const cmdText = document.getElementById("cmd-text");
    if (!copyBtn || !cmdText) {
      return;
    }

    copyBtn.addEventListener("click", () => {
      const text = cmdText.textContent?.trim() || "bun add @qntx/core";
      navigator.clipboard
        .writeText(text)
        .then(() => {
          const original = copyBtn.textContent;
          copyBtn.textContent = "COPIED";
          copyBtn.classList.add("bg-neutral-900", "text-white");
          setTimeout(() => {
            copyBtn.textContent = original;
            copyBtn.classList.remove("bg-neutral-900", "text-white");
          }, 1600);
        })
        .catch(() => {
          // Ignore clipboard permission errors
        });
    });
  }

  private initScrollAndNav(): void {
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "1") {
        document.getElementById("page-1")?.scrollIntoView({ behavior: "smooth" });
      } else if (e.key === "2") {
        document.getElementById("page-2")?.scrollIntoView({ behavior: "smooth" });
      } else if (e.key.toLowerCase() === "l") {
        this.cycleLook();
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            const { id } = entry.target;
            const indicator = document.getElementById("current-page-badge");
            if (indicator) {
              indicator.textContent = id === "page-2" ? "02" : "01";
            }
            document.querySelectorAll("[data-page-link]").forEach((link) => {
              const target = link.getAttribute("data-page-link");
              link.classList.toggle("text-neutral-900", target === id);
              link.classList.toggle("font-bold", target === id);
              link.classList.toggle("text-neutral-400", target !== id);
            });
          }
        }
      },
      { threshold: [0.4, 0.7] },
    );

    const p1 = document.getElementById("page-1");
    const p2 = document.getElementById("page-2");
    if (p1) {
      observer.observe(p1);
    }
    if (p2) {
      observer.observe(p2);
    }
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    new AsciiEngine();
  });
}
