// @vitest-environment node
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";

const SECURITY_HEADERS = [
  "x-content-type-options",
  "x-frame-options",
  "referrer-policy",
  "permissions-policy",
  "content-security-policy",
  "strict-transport-security",
  "x-xss-protection",
];

function startFakeGateway() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ url: req.url }));
    });
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

function assertNoSecurityHeaders(res) {
  for (const header of SECURITY_HEADERS) {
    expect(res.headers[header]).toBeUndefined();
  }
}

describe("portail authenticator - aucune pose de header de securite (SCRUM-179 AC2)", () => {
  let gateway;
  let distDir;
  let app;

  beforeAll(async () => {
    gateway = await startFakeGateway();
    distDir = fs.mkdtempSync(path.join(os.tmpdir(), "portail-179-"));
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

  it("la route /health du portail ne pose aucun header de securite", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    assertNoSecurityHeaders(res);
  });

  it("le fallback SPA ne pose aucun header de securite", async () => {
    const res = await request(app).get("/login");
    expect(res.status).toBe(200);
    assertNoSecurityHeaders(res);
  });

  it("les fichiers statiques ne posent aucun header de securite", async () => {
    const res = await request(app).get("/app.css");
    expect(res.status).toBe(200);
    assertNoSecurityHeaders(res);
  });

  it("les reponses proxifiees /api ne posent aucun header de securite cote portail", async () => {
    const res = await request(app).get("/api/auth/ping");
    assertNoSecurityHeaders(res);
  });
});
