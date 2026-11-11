# qntx-oweb

<p align="center">
  <img src="./public/favicon.svg" alt="QuantX Logo" width="80" height="80" />
</p>

<h3 align="center">QuantX — The Economic Layer for Autonomous AI Agents</h3>

<p align="center">
  Official website and protocol terminal for <b>QuantX Labs</b> and the <b>x402 Protocol</b>.
</p>

<p align="center">
  <a href="https://astro.build"><img src="https://img.shields.io/badge/Astro-v7.4-FF5D01.svg?style=flat-square&logo=astro&logoColor=white" alt="Astro" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC.svg?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://bun.sh"><img src="https://img.shields.io/badge/Bun-Package_Manager-fbf0df.svg?style=flat-square&logo=bun&logoColor=black" alt="Bun" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-Strict-3178C6.svg?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://github.com/qntx/qntx-oweb/actions"><img src="https://img.shields.io/badge/CI-GitHub_Pages-2088FF.svg?style=flat-square&logo=githubactions&logoColor=white" alt="GitHub Pages CI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT%2FApache_2.0-blue.svg?style=flat-square" alt="License" /></a>
</p>

---

<p align="center">
  <a href="#english">English</a> • <a href="#简体中文">简体中文</a>
</p>

---

<a name="english"></a>

## 🌐 Overview

**qntx-oweb** is the official landing terminal for [QuantX Labs](https://github.com/qntx). It serves as the primary visual and informational gateway introducing the **x402 Protocol** — an open economic protocol enabling autonomous AI agents to transact, collaborate, govern, and settle micro-transactions on-chain.

### ✨ Key Features

- **⚡ High-Performance Static Stack**: Built with [Astro v7](https://astro.build) and [Tailwind CSS v4](https://tailwindcss.com) for zero-JS static HTML by default and near-instant initial page loads.
- **🔳 Kinetic ASCII & Pixel-Art Narrative Canvas Engine**: A custom, zero-dependency 2D canvas engine (`hero-canvas/`) simulating a retro phosphor terminal display:
  - **Deterministic 30 FPS Fixed-Timestep Loop**: Mechanical 33.33ms physics step accumulator ensuring predictable animation speeds across 60Hz, 120Hz, and variable-refresh-rate displays.
  - **Stage-to-Real-Grid Responsive Projection**: Maps a canonical 128×40 stage to real physical canvas cells with dynamic horizontal compression factor $k = \max(0.6, \text{realCols} / 128)$ and strict integer pixel snapping.
  - **1600-Particle Morphing Pool**: Zero runtime garbage collection (GC) overhead; preallocated particle pool with deterministic Lehmer PRNG stagger transitions for organic particle dissolves.
  - **Narrative Storyline Choreography (~16s loop)**:
    - **QNTX Wordmark & CTA Flash**: Column-by-column crystallization into the brand wordmark, with double "X" flashes dispatched to DOM listeners to invert the `[GET STARTED]` button.
    - **Scene 1 (x402 Micropayment Protocol Interaction)**: Agent A submits a folded-corner task document -> Agent B demands `x402` payment with a pure dollar symbol -> Agent A ejects a 7×7 `$` sprite from its head slot into Agent B -> Agent B verifies and delivers a bold `✓` success checkmark.
    - **Scene 2 (Mitotic Swarm Division & High-Frequency Trading)**: Single Agent branches through 4 mitotic divisions into a 4×4 network (16 mini Agents) performing intense peer-to-peer micro-transactions before morphing back into QNTX.
- **🖥️ Wide-Screen & Zoom Adaptive Layout**:
  - Fluid adaptive container layout (`max-w-[1680px] 2xl:max-w-[92vw]`) eliminating excessive whitespace margins on 2K/4K displays and small browser zoom levels (50%~80%).
  - Responsive padding tiers (`px-6 sm:px-10 lg:px-14 xl:px-18 2xl:px-24`) maintaining comfortable golden-ratio distance to the browser window edges.
  - Scalable hero canvas wrapper (`max-w-[900px] lg:max-w-[1000px] xl:max-w-[1100px] 2xl:max-w-[1200px]`) with automatic grid recalculation via `ResizeObserver`.
- **♿ Battery & Accessibility Friendly**:
  - `IntersectionObserver` automatically halts `requestAnimationFrame` when the canvas scrolls out of view.
  - Page `visibilitychange` pauses processing in background tabs and clears accumulated delta time.
  - `prefers-reduced-motion` automatically falls back to an elegant static crossfade mode.
- **🎨 Minimalist Web3 Aesthetic & Typography**:
  - Subtle 1px dot grid background texture (`radial-gradient`), pure monochrome contrast, and elimination of visual clutter.
  - Balanced typographic hierarchy pairing `CKTKingKong` display font with `Satoshi` and clean monospace accents.

---

## 🏗️ Project Structure

```text
qntx-oweb/
├── .github/
│   └── workflows/
│       └── astro.yml          # Automated GitHub Pages CI/CD workflow
├── public/
│   ├── favicon.ico
│   ├── favicon.svg            # QuantX vector logo
│   ├── qntx.png               # Reference bitmap for wordmark sampling
│   ├── money.svg              # Reference vector for dollar icon
│   ├── request.svg            # Reference vector for task icon
│   ├── success.svg            # Reference vector for checkmark icon
│   └── fonts/                 # Web font assets (CKTKingKong, GeistPixel-Square, Satoshi)
├── src/
│   ├── components/            # Astro UI components
│   │   ├── Header.astro       # Minimalist top navigation bar (responsive 92vw)
│   │   ├── PageOne.astro      # Centerpiece kinetic ASCII stage & refined slogan
│   │   └── Footer.astro       # Understated copyright & core protocol links
│   ├── layouts/
│   │   └── Layout.astro       # Base HTML document shell, metadata & fonts
│   ├── pages/
│   │   └── index.astro        # Single-page terminal entry route
│   ├── scripts/
│   │   ├── hero-canvas/       # Core kinetic ASCII & pixel-art canvas engine
│   │   │   ├── index.ts       # Entrypoint, lifecycle management & DOM CTA wiring
│   │   │   ├── engine.ts      # 30 FPS loop, grid projection, pixel rasterizer & a11y
│   │   │   ├── timeline.ts    # State machine coordinating narrative phases & transitions
│   │   │   ├── scenes.ts      # QNTX, Scene 1 (Payment), and Scene 2 (Trading) frame generators
│   │   │   ├── sprites.ts     # 1-bit ASCII pixel art matrices & dynamic deformation math
│   │   │   ├── particles.ts   # 1600-particle pool with Lehmer PRNG stagger dissolve
│   │   │   ├── config.ts      # Declarative stage, grid, timing, and color constants
│   │   │   └── types.ts       # Strict TypeScript definitions for cells, sprites, & beats
│   │   ├── qntx-data.ts       # 84x18 density matrix extracted from qntx.png
│   │   └── nav.ts             # Navigation & client interaction helpers
│   └── styles/
│       └── global.css         # Tailwind CSS v4 design tokens & font-face declarations
├── astro.config.mjs           # Astro and Vite plugins configuration
├── oxfmt.config.ts            # Code formatting configuration
├── oxlint.config.ts           # Linter rules and configuration
├── package.json               # Project dependencies and script runner
├── tsconfig.json              # TypeScript compiler configuration (Path alias: @/*)
└── README.md
```

---

## 🛠️ Tech Stack

| Technology                                                | Purpose                                                         |
| :-------------------------------------------------------- | :-------------------------------------------------------------- |
| **[Astro](https://astro.build/)**                         | Content-first static site generation and component runtime      |
| **[Tailwind CSS v4](https://tailwindcss.com/)**           | Next-generation utility-first styling (via `@tailwindcss/vite`) |
| **[TypeScript](https://www.typescriptlang.org/)**         | Strict static type safety across components and canvas logic    |
| **[Bun](https://bun.sh/)**                                | High-speed JavaScript runtime and package manager               |
| **[Oxlint](https://oxc.rs/) & [Oxfmt](https://oxc.rs/)**  | Rust-based ultra-fast linter and code formatter                 |
| **[GitHub Actions](https://github.com/features/actions)** | Automated static build and GitHub Pages deployment              |

---

## 🚀 Getting Started

### Prerequisites

- **[Bun](https://bun.sh)** (recommended) or Node.js `>= 22.22.0`

### 1. Clone the repository

```bash
git clone https://github.com/qntx/qntx-oweb.git
cd qntx-oweb
```

### 2. Install dependencies

```bash
bun install
```

### 3. Start local development server

```bash
bun dev
```

Visit [`http://localhost:4321`](http://localhost:4321) in your browser.

> [!TIP]
> To run the dev server in the background:
>
> ```bash
> bun run astro dev --background
> ```
>
> Use `astro dev status`, `astro dev logs`, and `astro dev stop` to manage the background process.

### 4. Build for production

```bash
bun run build
```

The production output will be generated inside the `./dist/` directory.

### 5. Preview production build

```bash
bun run preview
```

---

## 📜 Available Scripts

| Command                | Action                                                          |
| :--------------------- | :-------------------------------------------------------------- |
| `bun run dev`          | Starts the Astro development server (`localhost:4321`)          |
| `bun run build`        | Compiles static site to `./dist/` for production                |
| `bun run preview`      | Runs local HTTP server to preview `./dist/`                     |
| `bun run check`        | Validates Astro files and TypeScript types via `@astrojs/check` |
| `bun run lint`         | Runs `oxlint` for high-speed static code analysis               |
| `bun run format`       | Formats all source files with `oxfmt`                           |
| `bun run format:check` | Verifies code formatting compliance                             |

---

## 🌐 QuantX Ecosystem Repositories

| Repository                                                  | Stack       | Description                                                                                         |
| :---------------------------------------------------------- | :---------- | :-------------------------------------------------------------------------------------------------- |
| **[qntx/r402](https://github.com/qntx/r402)**               | Rust        | Rust SDK for the x402 payment protocol.                                                             |
| **[qntx/openai](https://github.com/qntx/openai)**           | TS / Python | Drop-in OpenAI clients with transparent HTTP 402 micropayment support.                              |
| **[qntx/facilitator](https://github.com/qntx/facilitator)** | Rust        | Production-ready facilitator server handling payment verification, gas sponsorship, and settlement. |
| **[qntx/kobe](https://github.com/qntx/kobe)**               | Rust        | Lightweight, `no_std` multi-chain HD wallet derivation library.                                     |
| **[qntx/qmd](https://github.com/qntx/qmd)**                 | Rust        | Lightweight local search engine designed for AI agents.                                             |
| **[qntx/ks](https://github.com/qntx/ks)**                   | Rust        | Local-first, age-encrypted secret manager for autonomous agents.                                    |
| **[qntx/nostr](https://github.com/qntx/nostr)**             | TS / Rust   | Nostr protocol implementation and SDK for decentralized agent communication.                        |

---

<a name="简体中文"></a>

## 🇨🇳 简体中文说明

### 🌟 项目简介

**qntx-oweb** 是 [QuantX Labs](https://github.com/qntx) 的官方网站终端。主要用于展示 **x402 协议**（为自主 AI Agent 构建的链上经济基础设施，支持 Monad 上的 Permit2 原生微支付）以及 QuantX 开源生态系统中的核心协议与基础工具链。

### 💡 核心特性

- **极速现代技术栈**：基于 Astro 7 + Tailwind CSS v4，默认生成静态 HTML，极致首屏加载性能。
- **动态叙事像素 Canvas 引擎**：纯原生开发、零外部库依赖的 2D 终端光栅化引擎（`hero-canvas/`）：
  - **30 FPS 固定时钟物理步进**：采用 33.33ms 机械累加器，确保在 60Hz、120Hz、144Hz 等不同刷新率屏幕下动画速率绝对确定。
  - **响应式舞台投影**：逻辑舞台（128×40）通过自适应压缩因子 $k = \max(0.6, \text{realCols} / 128)$ 等比映射到物理画布，配合整像素对齐（Integer Pixel Snapping），杜绝次像素模糊。
  - **1600 粒子常驻对象池**：全程零 GC 停顿；利用确定性 Lehmer 伪随机数算法（PRNG）实现粒子随机延迟消融（Dissolve）与飞渡重组。
  - **连续叙事剧本循环（约 16 秒）**：
    - **QNTX 字标与 CTA 联动**：逐列结晶构建字标，字母 "X" 闪烁时向外派发事件，触发 DOM 层 `[GET STARTED]` 按钮黑白反色。
    - **场景一：x402 任务与微支付交互**：Agent A 发送折角工单 -> Agent B 返回携带 `$` 符号的 `x402` 支付气泡 -> Agent A 投币槽升起纯 `$` 符号飞入 Agent B 头顶 -> Agent B 接收思考后交付粗线条 `✓` 成功图案。
    - **场景二：群体网络分裂与高频交易**：单只 Agent 经 4 轮有丝分裂平滑展开为 4×4（16 只小 Agent）交易网络，进行持续 3.4 秒的高频密集代币互换（底层节点增强），最后粒子消融回归 QNTX 字标。
- **宽屏与低缩放流式布局优化**：
  - 突破传统硬编码宽度，采用流式容器规范（`max-w-[1680px] 2xl:max-w-[92vw]`），彻底解决在 2K/4K 宽屏或浏览器缩小比例（50%~80%）时两侧留白过多的问题。
  - 阶梯式响应边距（`px-6 sm:px-10 lg:px-14 xl:px-18 2xl:px-24`），使页面与窗口始终维持黄金比例距离。
  - 画布容器弹性扩容（`max-w-[900px] lg:max-w-[1000px] xl:max-w-[1100px] 2xl:max-w-[1200px]`），依托 `ResizeObserver` 动态自适应居中。
- **无障碍与功耗优化**：
  - `IntersectionObserver` 监控画布，滑出视口立即挂起动画，GPU/CPU 负载归零。
  - `visibilitychange` 监听后台标签页，切回后清空累加器，消除时间补偿追赶卡顿。
  - 支持 `prefers-reduced-motion` 系统无障碍降级，为晕动症用户提供平滑淡入淡出。
- **克制极简 Web3 艺术品风格**：极致大留白负空间排版、超轻量 1px 点阵网格纸质质感、纯粹黑白高对比度。

### 📦 常用开发命令

```bash
# 安装依赖
bun install

# 启动本地开发服务 (localhost:4321)
bun dev

# 编译生产包 (输出至 ./dist/)
bun run build

# 本地预览生产构建产物
bun run preview

# 类型与 Astro 组件语法检查
bun run check

# 执行代码静态检查 (oxlint)
bun run lint

# 执行代码自动化格式化 (oxfmt)
bun run format
```

---

## 🚀 部署与 CI/CD

本项目通过 GitHub Actions 进行自动化持续集成与部署：

- 配置文件位于 [`.github/workflows/astro.yml`](./.github/workflows/astro.yml)。
- 当代码合并至 `master` 分支时，工作流自动配置 Bun 环境、安装依赖、编译生成静态文件，并发布至 **GitHub Pages**。

---

## 🤝 社区与支持

- **官网文档**: [https://docs.qntx.org](https://docs.qntx.org)
- **GitHub 组织**: [@qntx](https://github.com/qntx)
- **Twitter / X**: [@qntxorg](https://x.com/qntxorg)
- **博客**: [https://qntx.org/blog](https://qntx.org/blog)

---

## 📄 开源许可证

本项目基于 [MIT](https://opensource.org/licenses/MIT) / [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0) 协议开源。
