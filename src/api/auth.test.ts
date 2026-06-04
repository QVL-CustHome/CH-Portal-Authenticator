import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ApiError,
  forgotPassword,
  getMe,
  login,
  logout,
  register,
  resetPassword,
} from "./auth";

function mockFetch(status: number, body?: unknown) {
  const fn = vi.fn().mockResolvedValue(
    new Response(body === undefined ? null : JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    })
  );
  vi.stubGlobal("fetch", fn);
  return fn;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("client API /api/auth", () => {
  it("login appelle POST /api/auth/login avec email et mot de passe", async () => {
    const fetchMock = mockFetch(200, { ok: true });
    await login("a@b.fr", "secret123");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "a@b.fr", password: "secret123" }),
        credentials: "same-origin",
      })
    );
  });

  it("register appelle POST /api/auth/register", async () => {
    const fetchMock = mockFetch(201, {});
    await register("a@b.fr", "secret123");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/register",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("forgotPassword appelle POST /api/auth/password/forgot", async () => {
    const fetchMock = mockFetch(202);
    await forgotPassword("a@b.fr");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/password/forgot",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("resetPassword envoie {token, new_password}", async () => {
    const fetchMock = mockFetch(200, {});
    await resetPassword("tok", "nouveau-mdp");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/password/reset",
      expect.objectContaining({
        body: JSON.stringify({ token: "tok", new_password: "nouveau-mdp" }),
      })
    );
  });

  it("getMe retourne le profil", async () => {
    mockFetch(200, { user_id: "1", email: "a@b.fr", roles: {} });
    const me = await getMe();
    expect(me.email).toBe("a@b.fr");
  });

  it("logout appelle POST /api/auth/logout", async () => {
    const fetchMock = mockFetch(204);
    await logout();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/logout",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("leve une ApiError avec le status sur reponse non-2xx", async () => {
    mockFetch(401, { error: "invalid credentials" });
    await expect(getMe()).rejects.toMatchObject({ status: 401 });
  });

  it("expose le message d'erreur du corps JSON si present", async () => {
    mockFetch(409, { error: "email deja utilise" });
    await expect(register("a@b.fr", "x".repeat(8))).rejects.toThrow(
      "email deja utilise"
    );
  });

  it("garde un message generique si le corps n'est pas du JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("boom", { status: 500 }))
    );
    await expect(getMe()).rejects.toBeInstanceOf(ApiError);
  });
});
