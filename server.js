// CH-Portail-Authenticator - serveur Node.js (prod)
// Sert le build React (dist/) et proxifie /api vers CH-Api-GateWay,
// de sorte que le navigateur reste en same-origin (cookies HttpOnly ch_token / ch_refresh).
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT ?? 3000);
const GATEWAY_URL = process.env.GATEWAY_URL ?? "http://localhost:8080";
const DIST = path.join(__dirname, "dist");

const app = express();
app.disable("x-powered-by");

// Etat du portail (utilise par la supervision, jamais proxifie)
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "ch-portail-authenticator" });
});

// Tous les appels API du front passent par le Gateway (ex: /api/auth/login)
app.use(
  "/api",
  createProxyMiddleware({
    target: GATEWAY_URL,
    changeOrigin: true,
    xfwd: true,
  })
);

// Front React buildee + fallback SPA (react-router gere les routes cote client)
app.use(express.static(DIST));
app.use((_req, res) => {
  res.sendFile(path.join(DIST, "index.html"));
});

app.listen(PORT, () => {
  console.log(
    JSON.stringify({
      level: "INFO",
      msg: "portail demarre",
      port: PORT,
      gateway_url: GATEWAY_URL,
    })
  );
});
