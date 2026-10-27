/**
 * QuantX ASCII Engine
 * Inspired by ascii-magic.com/ascii#library
 * Provides:
 *  - Character set Look Switcher (Squares, ASCII, Binary, Dots)
 *  - Animated ASCII Lettering restyling
 *  - LiveData telemetry stream & ASCII waveform visualizer
 *  - Keyboard page navigation (1 & 2)
 */

export const LOOKS = {
  squares: {
    key: 'squares',
    label: 'Squares',
    symbol: '·▪■',
    solid: '■',
    mid: '▪',
    light: '▫',
    dot: '·',
  },
  ascii: {
    key: 'ascii',
    label: 'ASCII',
    symbol: '#/!',
    solid: '#',
    mid: '*',
    light: '=',
    dot: '.',
  },
  binary: {
    key: 'binary',
    label: 'Binary',
    symbol: '010',
    solid: '1',
    mid: '1',
    light: '0',
    dot: '0',
  },
  dots: {
    key: 'dots',
    label: 'Dots',
    symbol: '·•●',
    solid: '●',
    mid: '•',
    light: '·',
    dot: ' ',
  },
};

const BASE_LETTERING = `
 ▄████▄  ██   ██   █████   ███   ██ ████████ ██   ██
██    ██ ██   ██  ██   ██  ████  ██    ██     ██ ██ 
██    ██ ██   ██  ███████  ██ ██ ██    ██      ███  
██ ▄▄ ██ ██   ██  ██   ██  ██  ████    ██     ██ ██ 
 ▀████▀   ▀███▀   ██   ██  ██   ███    ██    ██   ██
      ▀▀                                            
`.trim();

const AGENT_NAMES = [
  '0x9A4F',
  '0x14E2',
  '0x7BC0',
  '0x3ED8',
  '0x82A1',
  '0x0DF4',
  '0x5C9B',
];

const ENDPOINTS = [
  '/v1/chat',
  '/v1/embeddings',
  '/v1/memory',
  '/v1/exec',
  '/v1/search',
];

class AsciiEngine {
  constructor() {
    this.currentLook = 'squares';
    this.tps = 2842;
    this.latency = 11.4;
    this.settledCount = 184920;
    this.isLivePlaying = true;
    this.waveHistory = [4, 6, 8, 12, 10, 7, 5, 8, 14, 18, 15, 11, 9, 13, 16, 20, 17, 12, 9, 6, 8, 12, 15, 11, 7, 5, 9, 14, 12, 8];
    this.txLog = [];
    
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    this.initLookSwitcher();
    this.renderLettering();
    this.initCopyButton();
    this.initKeyboardNav();
    this.initLiveData();
  }

  setLook(lookKey) {
    if (!LOOKS[lookKey]) return;
    this.currentLook = lookKey;

    // Update active button classes
    document.querySelectorAll('[data-look-btn]').forEach((btn) => {
      const active = btn.getAttribute('data-look-btn') === lookKey;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    // Re-render lettering with new look glyphs
    this.renderLettering();

    // Re-render live telemetry and charts immediately
    this.renderWaveform();
    this.renderTxLog();
  }

  initLookSwitcher() {
    document.querySelectorAll('[data-look-btn]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lookKey = btn.getAttribute('data-look-btn');
        if (lookKey) this.setLook(lookKey);
      });
    });
  }

  renderLettering() {
    const el = document.getElementById('ascii-lettering');
    if (!el) return;

    const look = LOOKS[this.currentLook];
    let output = '';

    for (const ch of BASE_LETTERING) {
      if (ch === '█') output += look.solid;
      else if (ch === '▄' || ch === '▀') output += look.mid;
      else if (ch === '░' || ch === '▒') output += look.light;
      else output += ch;
    }

    el.textContent = output;
  }

  initCopyButton() {
    const copyBtn = document.getElementById('copy-cmd-btn');
    const cmdText = document.getElementById('cmd-text');
    if (!copyBtn || !cmdText) return;

    copyBtn.addEventListener('click', async () => {
      const text = cmdText.textContent?.trim() || 'npm i @qntx/openai';
      try {
        await navigator.clipboard.writeText(text);
        const original = copyBtn.textContent;
        copyBtn.textContent = '[ COPIED ✓ ]';
        copyBtn.classList.add('bg-white', 'text-black');
        setTimeout(() => {
          copyBtn.textContent = original;
          copyBtn.classList.remove('bg-white', 'text-black');
        }, 1800);
      } catch (err) {
        console.error('Copy failed', err);
      }
    });
  }

  initKeyboardNav() {
    window.addEventListener('keydown', (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === '1') {
        const p1 = document.getElementById('page-1');
        p1?.scrollIntoView({ behavior: 'smooth' });
      } else if (e.key === '2') {
        const p2 = document.getElementById('page-2');
        p2?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  initLiveData() {
    // Generate initial transaction log
    for (let i = 0; i < 5; i++) {
      this.addRandomTx();
    }
    this.renderTxLog();
    this.renderWaveform();

    // Start background ticker
    setInterval(() => {
      if (!this.isLivePlaying) return;
      this.tick();
    }, 900);
  }

  addRandomTx() {
    const now = new Date();
    const time = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
    const agent = AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)];
    const ep = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];
    const fee = (0.0001 + Math.random() * 0.0008).toFixed(4);
    const ms = (8 + Math.random() * 9).toFixed(1);

    this.txLog.unshift({ time, agent, ep, fee, ms });
    if (this.txLog.length > 5) this.txLog.pop();

    this.settledCount += 1;
    this.tps = Math.floor(2800 + Math.random() * 90);
    this.latency = (10.8 + Math.random() * 1.4).toFixed(1);

    // Update wave history
    const nextVal = Math.max(3, Math.min(22, Math.round(this.waveHistory[this.waveHistory.length - 1] + (Math.random() * 6 - 3))));
    this.waveHistory.push(nextVal);
    this.waveHistory.shift();
  }

  tick() {
    this.addRandomTx();
    this.renderTxLog();
    this.renderWaveform();
    this.updateStats();
  }

  updateStats() {
    const tpsEl = document.getElementById('stat-tps');
    const latEl = document.getElementById('stat-latency');
    const settledEl = document.getElementById('stat-settled');

    if (tpsEl) tpsEl.textContent = `${this.tps.toLocaleString()} TX/S`;
    if (latEl) latEl.textContent = `${this.latency} ms`;
    if (settledEl) settledEl.textContent = `$${this.settledCount.toLocaleString()}`;
  }

  renderTxLog() {
    const container = document.getElementById('live-tx-feed');
    if (!container) return;

    const look = LOOKS[this.currentLook];

    const lines = this.txLog.map((tx, idx) => {
      const isNew = idx === 0;
      const marker = isNew ? look.solid : look.mid;
      return `<div class="truncate ${isNew ? 'text-white' : 'text-neutral-400'} font-mono text-[11px] sm:text-xs leading-relaxed flex items-center gap-2">
        <span class="${isNew ? 'text-emerald-400' : 'text-neutral-600'} font-bold">${marker}</span>
        <span class="text-neutral-500">[${tx.time}]</span>
        <span class="text-neutral-300 font-semibold">${tx.agent}</span>
        <span class="text-neutral-500">─(402: ${tx.fee} MON)─></span>
        <span class="text-neutral-400">${tx.ep}</span>
        <span class="text-emerald-400">200 OK</span>
        <span class="text-neutral-600">${tx.ms}ms</span>
      </div>`;
    });

    container.innerHTML = lines.join('');
  }

  renderWaveform() {
    const el = document.getElementById('ascii-waveform');
    if (!el) return;

    const look = LOOKS[this.currentLook];
    const height = 5;
    const maxVal = 24;
    let grid = Array(height).fill('').map(() => Array(this.waveHistory.length).fill(' '));

    for (let c = 0; c < this.waveHistory.length; c++) {
      const val = this.waveHistory[c];
      const normalizedRow = Math.min(height - 1, Math.floor((val / maxVal) * height));
      for (let r = 0; r < height; r++) {
        const visualRow = height - 1 - r;
        if (r < normalizedRow) {
          grid[visualRow][c] = look.light;
        } else if (r === normalizedRow) {
          grid[visualRow][c] = look.solid;
        } else {
          grid[visualRow][c] = ' ';
        }
      }
    }

    const asciiChart = grid.map((row) => row.join('')).join('\n');
    el.textContent = asciiChart;
  }
}

// Instantiate on client
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    window.__QNTX_ASCII__ = new AsciiEngine();
  });
}
