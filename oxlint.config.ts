import { defineConfig } from "oxlint";

import { config } from "@qntx/oxlint";

export default defineConfig({
  ...config,
  plugins: ["typescript"],
  ignorePatterns: ["dist/**", ".astro/**", "**/*.astro"],
});
