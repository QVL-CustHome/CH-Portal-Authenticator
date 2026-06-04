/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// En dev le front tourne sur :3000 (auth_front_url du Gateway) et proxifie
// directement /api vers le Gateway - meme comportement que server.js en prod.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: process.env.GATEWAY_URL ?? "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}", "app.js"],
      // navigation.ts : shim navigateur d'une ligne, mocke par design dans les tests
      exclude: ["src/main.tsx", "src/test/**", "src/lib/navigation.ts"],
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 80,
      },
    },
  },
});
