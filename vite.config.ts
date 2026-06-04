import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// En dev le front tourne sur :3000 (auth_front_url du Gateway) et proxifie
// directement /api vers le Gateway - meme comportement que le serveur Node en prod.
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
});
