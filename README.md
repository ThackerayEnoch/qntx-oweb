# qntx-oweb

<p align="center">
  <img src="./public/favicon.svg" alt="QuantX Logo" width="80" height="80" />
</p>

<h3 align="center">QuantX — The Economic Layer for Autonomous AI Agents</h3>

<p align="center">
  Official website and landing portal for <b>QuantX Labs</b> and the <b>x402 Protocol</b>.
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

**qntx-oweb** is the official web portal for [QuantX Labs](https://github.com/qntx). It serves as the primary gateway introducing the **x402 Protocol** — an open economic protocol enabling autonomous AI agents to transact, collaborate, govern, and evolve independently on-chain with native micro-settlement primitives on Monad (Permit2).

### ✨ Key Features

- **⚡ Modern High-Performance Stack**: Built with [Astro](https://astro.build) and [Tailwind CSS v4](https://tailwindcss.com) for zero-JS static HTML by default and ultra-fast page loads.
- **🎨 Futuristic Cyber-Minimalist Aesthetic**: High-contrast dark/light mode balance, monospace typography (`JetBrains Mono` & `Geist`), and terminal-style interface accents.
- **🧊 Interactive 3D Voxel Field**: Canvas-rendered 3D interactive particle/voxel visualization responding smoothly to viewports and animations.
- **🧩 Decoupled View Architecture**: Clean separation between presentation components, TypeScript definitions, and content models (`home.data.ts` + `home.types.ts`).
- **🚀 Monad Native & x402 Protocol**: Comprehensive documentation links, ecosystem primitives, and interactive terminal snippet copy capabilities.
- **📦 Fast Developer Tooling**: Powered by [Bun](https://bun.sh), with [Oxlint](https://oxc.rs) and [Oxfmt](https://oxc.rs) for lightning-fast linting and formatting.

---

## 🏗️ Project Structure

```text
qntx-oweb/
├── .github/
│   └── workflows/
│       └── astro.yml            # Automated GitHub Pages CI/CD workflow
├── public/
│   ├── favicon.ico
│   └── favicon.svg              # QuantX vector logo
├── src/
│   ├── assets/                  # Static graphic assets (astro.svg, quantx.svg, etc.)
│   ├── components/              # Shared UI components (Header, Footer, Logo, Divider)
│   ├── layouts/                 # Base HTML layout and font/metadata orchestration
│   ├── pages/                   # Astro page routes
│   │   └── index.astro          # Landing page entry point
│   ├── scripts/                 # Client scripts (3D voxel animation, motion, media query utils)
│   ├── styles/                  # Tailwind CSS v4 design tokens and global styles
│   └── views/
│       └── home/                # Modular home view implementation
│           ├── components/      # Section components: Hero, Thesis, Ecosystem, About, Cta
│           ├── home.data.ts     # Content data model and external links
│           ├── home.types.ts    # TypeScript interfaces for sections and props
│           ├── HomeView.astro   # Main page layout orchestrator
│           └── index.ts         # Module barrel exports
├── astro.config.mjs             # Astro and Vite plugins configuration
├── oxfmt.config.ts              # Code formatting configuration
├── oxlint.config.ts             # Linter rules and configuration
├── package.json                 # Project dependencies and script runner
├── tsconfig.json                # TypeScript compiler configuration (Path alias: @/*)
└── README.md
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **[Astro](https://astro.build/)** | Web framework optimized for content and performance |
| **[Tailwind CSS v4](https://tailwindcss.com/)** | Utility-first CSS framework (via `@tailwindcss/vite`) |
| **[TypeScript](https://www.typescriptlang.org/)** | Type safety across configurations and content models |
| **[Bun](https://bun.sh/)** | Blazing-fast JavaScript/TypeScript runtime & package manager |
| **[Oxlint](https://oxc.rs/) & [Oxfmt](https://oxc.rs/)** | Ultra-fast linter and code formatter |
| **[GitHub Actions](https://github.com/features/actions)** | Automated static build and GitHub Pages deployment |

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
> ```bash
> bun run astro dev --background
> ```
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

| Command | Action |
| :--- | :--- |
| `bun run dev` | Starts the Astro development server (`localhost:4321`) |
| `bun run build` | Compiles static site to `./dist/` for production |
| `bun run preview` | Runs local HTTP server to preview `./dist/` |
| `bun run check` | Validates Astro files and TypeScript types via `@astrojs/check` |
| `bun run lint` | Runs `oxlint` for high-speed static code analysis |
| `bun run format` | Formats all source files with `oxfmt` |
| `bun run format:check` | Verifies code formatting compliance |

---

## 🌐 QuantX Ecosystem Repositories

| Repository | Stack | Description |
| :--- | :--- | :--- |
| **[qntx/r402](https://github.com/qntx/r402)** | Rust | Rust SDK for the x402 payment protocol. |
| **[qntx/openai](https://github.com/qntx/openai)** | TS / Python | Drop-in OpenAI clients with transparent HTTP 402 micropayment support. |
| **[qntx/facilitator](https://github.com/qntx/facilitator)** | Rust | Production-ready facilitator server handling payment verification, gas sponsorship, and settlement. |
| **[qntx/kobe](https://github.com/qntx/kobe)** | Rust | Lightweight, `no_std` multi-chain HD wallet derivation library. |
| **[qntx/qmd](https://github.com/qntx/qmd)** | Rust | Lightweight local search engine designed for AI agents. |
| **[qntx/ks](https://github.com/qntx/ks)** | Rust | Local-first, age-encrypted secret manager for autonomous agents. |
| **[qntx/nostr](https://github.com/qntx/nostr)** | TS / Rust | Nostr protocol implementation and SDK for decentralized agent communication. |

---

<a name="简体中文"></a>

## 🇨🇳 简体中文说明

### 🌟 项目简介

**qntx-oweb** 是 [QuantX Labs](https://github.com/qntx) 的官方网站门户。主要用于展示 **x402 协议**（为自主 AI Agent 构建的链上经济基础设施，支持 Monad 上的 Permit2 原生微支付）以及 QuantX 开源生态系统中的基础库与工具链。

### 💡 核心特性

- **极速现代技术栈**：基于 Astro 7 + Tailwind CSS v4，默认生成静态 HTML，极致首屏加载性能。
- **赛博极简美学**：黑白对比设计风格，搭配 `JetBrains Mono` 与 `Geist` 等宽/正文字体，呈现硬核极客质感。
- **交互式 3D 体素画布**：内置高效的 Canvas 3D 粒子体素场动画 (`logo-animation.js`)，赋予页面沉浸式视觉交互。
- **数据视图解耦**：采用结构化模块设计，将文案配置 (`home.data.ts`)、类型系统 (`home.types.ts`) 与展示组件彻底解耦，易于维护扩展。
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

- **GitHub 组织**: [@qntx](https://github.com/qntx)
- **Twitter / X**: [@qntxorg](https://x.com/qntxorg)

---

## 📄 开源许可证

本项目基于 [MIT](https://opensource.org/licenses/MIT) / [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0) 协议开源。
