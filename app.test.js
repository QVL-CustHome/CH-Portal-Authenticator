// @vitest-environment node
// Tests du serveur Express : /health, proxy /api -> Gateway, statique + fallback SPA.
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";

// Gateway factice : echo la methode, le chemin et quelques en-tetes recus.
function startFakeGateway() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Set-Cookie", "ch_token=jeton-test; HttpOnly");
        res.end(
          JSON.stringify({
            method: req.method,
            url: req.url,
            xfwd: req.headers["x-forwarded-for"] ?? null,
            body,
          })
        );
      });
    });
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

describe("serveur du portail", () => {
  let gateway;
  let distDir;
  let app;

  beforeAll(async () => {
    gateway = await startFakeGateway();
    distDir = fs.mkdtempSync(path.join(os.tmpdir(), "portail-dist-"));
    fs.writeFileSync(
      path.join(distDir, "index.html"),
      "<!doctype html><div id=\"root\">portail</div>"
    );
    fs.writeFileSync(path.join(distDir, "app.css"), "body{}");
    const { port } = gateway.address();
    app = createApp({ gatewayUrl: `http://127.0.0.1:${port}`, distDir });
  });

  afterAll(() => {
    gateway.close();
    fs.rmSync(distDir, { recursive: true, force: true });
  });

  it("GET /health repond 200 localement sans passer par le Gateway", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: "ok",
      service: "ch-portail-authenticator",
    });
  });

  it("proxifie /api/* vers le Gateway en conservant chemin et methode", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "a@b.fr" });
    expect(res.status).toBe(200);
    expect(res.body.method).toBe("POST");
    expect(res.body.url).toBe("/api/auth/login");
  });

  it("transmet X-Forwarded-For au Gateway (xfwd)", async () => {
    const res = await request(app).get("/api/auth/ping");
    expect(res.body.xfwd).not.toBeNull();
  });

  it("laisse transiter les Set-Cookie du Gateway (cookies HttpOnly)", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.headers["set-cookie"]?.join(";")).toContain("ch_token=");
  });

  it("sert les fichiers statiques du build", async () => {
    const res = await request(app).get("/app.css");
    expect(res.status).toBe(200);
  });

  it("fallback SPA : une route front (/login) renvoie index.html", async () => {
    const res = await request(app).get("/login");
    expect(res.status).toBe(200);
    expect(res.text).toContain("portail");
  });

  it("ne fallback pas les routes /api inconnues vers index.html", async () => {
    const res = await request(app).get("/api/inconnu");
    // Reponse du gateway factice (200 echo), surtout pas le HTML du front
    expect(res.headers["content-type"]).toContain("application/json");
  });
});
