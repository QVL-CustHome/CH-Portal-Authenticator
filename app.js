// CH-Portail-Authenticator - application Express (testable, sans listen)
// Sert le build React (dist/) et proxifie /api vers CH-Api-GateWay,
// de sorte que le navigateur reste en same-origin (cookies HttpOnly ch_token / ch_refresh).
import path from "node:path";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

export function createApp({ gatewayUrl, distDir }) {
  const app = express();
  app.disable("x-powered-by");

  // Etat du portail (utilise par la supervision, jamais proxifie)
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "ch-portail-authenticator" });
  });

  // Tous les appels API du front passent par le Gateway (ex: /api/auth/login).
  // pathFilter (et non un montage app.use("/api")) pour que le Gateway recoive
  // le chemin complet /api/... attendu par ses routes (path_prefix /api/auth).
  app.use(
    createProxyMiddleware({
      pathFilter: "/api",
      target: gatewayUrl,
      changeOrigin: true,
      xfwd: true,
    })
  );

  // Front React buildee + fallback SPA (react-router gere les routes cote client)
  app.use(express.static(distDir));
  app.use((_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });

  return app;
}
