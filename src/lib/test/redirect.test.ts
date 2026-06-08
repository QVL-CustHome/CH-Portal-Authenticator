import { describe, expect, it } from "vitest";
import { safeRedirect } from "../redirect";

describe("safeRedirect (anti open-redirect)", () => {
  it("accepte un chemin relatif interne", () => {
    expect(safeRedirect("/api/users/42")).toBe("/api/users/42");
    expect(safeRedirect("/account?tab=roles")).toBe("/account?tab=roles");
  });

  it("retombe sur /account sans parametre", () => {
    expect(safeRedirect(null)).toBe("/account");
    expect(safeRedirect("")).toBe("/account");
  });

  it("rejette les URL absolues externes", () => {
    expect(safeRedirect("http://evil.example")).toBe("/account");
    expect(safeRedirect("https://evil.example/login")).toBe("/account");
  });

  it("rejette les URL protocol-relative (//)", () => {
    expect(safeRedirect("//evil.example")).toBe("/account");
  });

  it("rejette les schemes exotiques", () => {
    expect(safeRedirect("javascript:alert(1)")).toBe("/account");
  });
});
