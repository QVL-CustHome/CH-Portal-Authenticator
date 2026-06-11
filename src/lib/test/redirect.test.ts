import { describe, expect, it, afterEach } from "vitest";
import { safeRedirect, getRedirectTarget } from "../redirect";

afterEach(() => {
  document.cookie = "ch_redirect=; path=/; max-age=0";
});

describe("safeRedirect (anti open-redirect)", () => {
  it("accepte un chemin relatif interne", () => {
    expect(safeRedirect("/api/users/42")).toBe("/api/users/42");
    expect(safeRedirect("/account?tab=roles")).toBe("/account?tab=roles");
  });

  it("retombe sur /account sans parametre", () => {
    expect(safeRedirect(null)).toBe("/account");
    expect(safeRedirect("")).toBe("/account");
  });

  it("accepte une URL absolue vers un portail de confiance (allowlist)", () => {
    expect(safeRedirect("http://localhost:3201/dashboard")).toBe(
      "http://localhost:3201/dashboard"
    );
    expect(safeRedirect("http://localhost:3201/users?status=pending_validation")).toBe(
      "http://localhost:3201/users?status=pending_validation"
    );
  });

  it("rejette les URL absolues externes (hors allowlist)", () => {
    expect(safeRedirect("http://evil.example")).toBe("/account");
    expect(safeRedirect("https://evil.example/login")).toBe("/account");
    expect(safeRedirect("http://localhost:9999/steal")).toBe("/account");
  });

  it("rejette les URL protocol-relative (//)", () => {
    expect(safeRedirect("//evil.example")).toBe("/account");
  });

  it("rejette les schemes exotiques", () => {
    expect(safeRedirect("javascript:alert(1)")).toBe("/account");
  });
});

describe("getRedirectTarget (cookie)", () => {
  it("retourne null sans cookie", () => {
    expect(getRedirectTarget()).toBeNull();
  });

  it("lit et decode le cookie ch_redirect", () => {
    document.cookie = `ch_redirect=${encodeURIComponent("http://localhost:3201/users")}; path=/`;
    expect(getRedirectTarget()).toBe("http://localhost:3201/users");
  });

  it("supprime le cookie apres lecture", () => {
    document.cookie = `ch_redirect=${encodeURIComponent("/dashboard")}; path=/`;
    getRedirectTarget();
    expect(getRedirectTarget()).toBeNull();
  });

  it("retourne null pour une valeur mal encodee", () => {
    document.cookie = "ch_redirect=%E0%A4%A; path=/";
    expect(getRedirectTarget()).toBeNull();
  });
});
