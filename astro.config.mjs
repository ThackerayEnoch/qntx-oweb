// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  // 构建与解析配置
  vite: {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    server: {
      host: true,
      port: 4321,
    },
    build: {
      target: "esnext",
    },
  },
});
