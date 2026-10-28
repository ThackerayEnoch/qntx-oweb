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

- **⚡ Modern High-Performance Stack**: Built with [Astro v7](https://astro.build) and [Tailwind CSS v4](https://tailwindcss.com) for zero-JS static HTML by default and near-instant initial page loads.
- **🔳 Kinetic ASCII Squares Engine**: Real-time canvas-based halftone squares rasterizer (`ascii-canvas.ts`) inspired by ASCII Magic. Accurately sampled from the `qntx.png` brand logotype into an 84×18 matrix featuring:
  - **Horizontal Unfold Crystallization**: Smooth progressive column-by-column emergence on page load.
  - **Gravitational Cursor Tracking**: Interactive spatial deflection and proximity swelling around mouse cursor and touch pointers.
  - **Click/Tap Shockwaves**: Radial impulse waves propagating from contact points across the square field.
  - **Ambient Kinetic Waves**: Micro-amplitude idle breathing to keep the surface dynamically alive.
- **🎨 Restrained Minimalist Web3 Aesthetic**: Negative space composition, subtle 1px dot grid background texture, pure monochrome contrast, and elimination of clutter.
- **🔤 Clean Typography System**: Distinctive hierarchy pairing custom display typography with clean sans-serif (`Satoshi`) and monospace terminal accents.
- **📦 Ultra-Fast Tooling**: Powered by [Bun](https://bun.sh), with [Oxlint](https://oxc.rs) and [Oxfmt](https://oxc.rs) for sub-second static analysis and formatting.

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
│   ├── qntx.png               # Reference bitmap for ASCII Squares sampling
│   └── fonts/                 # Web font assets (CKTKingKong, GeistPixel-Square, Satoshi)
├── src/
│   ├── assets/                # Vector brand assets
│   ├── components/            # UI components
│   │   ├── Header.astro       # Minimalist top navigation bar
│   │   ├── PageOne.astro      # Centerpiece kinetic ASCII stage & slogan
│   │   └── Footer.astro       # Understated copyright & core protocol links
│   ├── layouts/
│   │   └── Layout.astro       # Base HTML document shell, metadata & script injection
│   ├── pages/
│   │   └── index.astro        # Single-page terminal entry route
│   ├── scripts/
│   │   ├── ascii-canvas.ts    # ASCII Squares canvas physics & rendering engine
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
- **动态 ASCII Squares 引擎**：参考 ASCII Magic 半调方块渲染逻辑，基于官方位图 `qntx.png` 精确映射为 84×18 动态网格：
  - **横向阶梯展开**：初次加载时沿水平方向逐列平滑结晶展开。
  - **重力指针交互**：鼠标或触控拖拽时触发弹性排斥偏移与方块表面膨胀（Swell）。
  - **触控/点击冲击波**：点击任意区域向外扩散环形波，逐层激发方块波动弹跳。
  - **环境呼吸微动效**：静止状态下带有微弱波动，消除静态死板感，呈现数字活体艺术。
- **克制极简 Web3 艺术品风格**：极致大留白负空间排版、超轻量 1px 点阵网格纸质质感、纯粹黑白高对比度。
- **单页精致终端架构**：去除冗余控制台与多屏翻页，精细化组织顶部 Logo、中心动态视觉焦点、Slogan 与极简页脚外链。
- **极速代码校验工具**：整合 Bun 生态与 Rust 编写的 Oxlint、Oxfmt 工具，毫秒级完成语法与格式检查。

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
