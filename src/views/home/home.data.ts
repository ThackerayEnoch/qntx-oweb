import type {
  HeroData,
  ThesisSectionData,
  EcosystemSectionData,
  AboutSectionData,
  CtaData,
} from "./home.types";

export const heroData: HeroData = {
  statusPill: "x402 Protocol v0.1 Live on Monad Testnet",
  headline: "Building the Economic Layer for Autonomous AI Agents.",
  subtitle:
    "Open protocols and infrastructure for AI agents to transact, collaborate, govern, and evolve autonomously on-chain.",
  tagline: "Agents earn. Agents pay. Agents scale.",
  actions: [
    {
      label: "Explore GitHub",
      href: "https://github.com/qntx",
      icon: "arrow_outward",
      variant: "primary",
    },
    {
      label: "Developer Docs",
      href: "https://github.com/qntx",
      icon: "description",
      variant: "secondary",
    },
  ],
  command: "npm i @qntx/openai",
  terminalNote: "# Transparent HTTP 402 micropayments on Monad Permit2",
};

export const thesisData: ThesisSectionData = {
  sectionTag: "[ 01 // THESIS ]",
  title: "x402 Protocol: Financial Autonomy for AI.",
  subtitle: "Intelligence is ready. Financial autonomy is not.",
  withoutX402: {
    badge: "STATUS QUO // LEGACY",
    title: "Without x402",
    description:
      "Agents rely on human credit cards and manual top-ups. When balance hits zero, agents halt.",
    items: [
      "Centralized API keys & custody vulnerability",
      "Manual human billing dependency",
      "Hard rate limits & pre-funded balance traps",
    ],
    theme: "light",
  },
  withX402: {
    badge: "x402 SPEC // MACHINE-NATIVE",
    title: "With x402",
    description:
      "Machine-native micropayments. Self-custodial wallets enable agents to earn and spend independently.",
    items: [
      "Sub-cent gasless settlement per call",
      "Deterministic cryptographic key control",
      "Zero human in the loop required",
    ],
    theme: "dark",
  },
};

export const ecosystemData: EcosystemSectionData = {
  sectionTag: "[ 02 // REPOSITORIES ]",
  title: "Open-Source Primitives.",
  subtitle: "Production-ready SDKs, wallets, and tooling built for machine-to-machine economies.",
  repos: [
    {
      name: "qntx/r402",
      href: "https://github.com/qntx/r402",
      tags: ["Rust"],
      description: "Rust SDK for the x402 payment protocol.",
      colSpan: "",
    },
    {
      name: "qntx/openai & qntx/openai-python",
      href: "https://github.com/qntx/openai",
      tags: ["TypeScript", "Python"],
      description: "Drop-in OpenAI clients with transparent HTTP 402 micropayment support.",
      colSpan: "md:col-span-2",
    },
    {
      name: "qntx/facilitator",
      href: "https://github.com/qntx/facilitator",
      tags: ["Rust"],
      description:
        "Production-ready x402 facilitator server handling payment verification, gas sponsorship, and settlement.",
      colSpan: "md:col-span-2",
    },
    {
      name: "qntx/kobe",
      href: "https://github.com/qntx/kobe",
      tags: ["Rust"],
      description: "Lightweight, no_std multi-chain HD wallet derivation library.",
      colSpan: "",
    },
    {
      name: "qntx/qmd",
      href: "https://github.com/qntx/qmd",
      tags: ["Rust"],
      description: "Lightweight local search engine designed for AI agents.",
      colSpan: "",
    },
    {
      name: "qntx/ks",
      href: "https://github.com/qntx/ks",
      tags: ["Rust"],
      description: "Local-first, age-encrypted secret manager for autonomous agents.",
      colSpan: "",
    },
    {
      name: "qntx/nostr",
      href: "https://github.com/qntx/nostr",
      tags: ["TS", "Rust"],
      description: "Nostr protocol implementation and SDK for decentralized agent communication.",
      colSpan: "",
    },
  ],
};

export const aboutData: AboutSectionData = {
  sectionTag: "[ 04 // QUANTX LABS ]",
  title: "Open-source autonomous agent economy layer",
  description:
    "We build on-chain micropayment infrastructure that lets AI agents transact and collaborate autonomously across borders and networks. We believe intelligence without sovereign financial agency remains fundamentally dependent.",
  tags: [
    { icon: "lock_open", label: "OPEN SOURCE MIT/APACHE 2.0" },
    { icon: "bolt", label: "MONAD ECOSYSTEM NATIVE" },
    { icon: "article", label: "RESEARCH WHITE-PAPER V1.2" },
  ],
  whitepaperHref: "https://github.com/qntx",
  communityHref: "https://x.com/qntxorg",
};

export const ctaData: CtaData = {
  badge: "GET STARTED TODAY",
  title: "Ready to build agents that pay for themselves?",
  description:
    "Integrate the x402 client in 3 lines of code. Deploy your autonomous agent economic enclave on Monad testnet today.",
  buttonText: "Get Started on GitHub →",
  buttonHref: "https://github.com/qntx",
};
