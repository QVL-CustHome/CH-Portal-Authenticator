import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import Account from "./Account";
import * as authApi from "../api/auth";

vi.mock("../api/auth", { spy: true });

const ME: authApi.Me = {
  user_id: "u1",
  email: "martin@custhome.fr",
  roles: { custhome: "admin" },
  whitelist_only: false,
  created_at: "2026-06-01T10:00:00Z",
};

function LoginProbe() {
  const location = useLocation();
  return <p>login: {location.search}</p>;
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/account"]}>
      <Routes>
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<LoginProbe />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("page Account", () => {
  it("affiche le profil retourne par GET /me", async () => {
    vi.mocked(authApi.getMe).mockResolvedValue(ME);
    renderPage();
    expect(await screen.findByText("martin@custhome.fr")).toBeInTheDocument();
    expect(screen.getByText("custhome : admin")).toBeInTheDocument();
  });

  it("affiche un placeholder si aucun role", async () => {
    vi.mocked(authApi.getMe).mockResolvedValue({ ...ME, roles: {} });
    renderPage();
    expect(await screen.findByText("Aucun rôle attribué")).toBeInTheDocument();
  });

  it("redirige vers /login?redirect=/account sur 401", async () => {
    vi.mocked(authApi.getMe).mockRejectedValue(
      new authApi.ApiError(401, "unauthorized")
    );
    renderPage();
    expect(
      await screen.findByText("login: ?redirect=/account")
    ).toBeInTheDocument();
  });

  it("affiche une erreur sur un echec non-401", async () => {
    vi.mocked(authApi.getMe).mockRejectedValue(
      new authApi.ApiError(500, "boom")
    );
    renderPage();
    expect(
      await screen.findByText("Impossible de charger le profil.")
    ).toBeInTheDocument();
  });

  it("se deconnecte puis revient sur /login", async () => {
    vi.mocked(authApi.getMe).mockResolvedValue(ME);
    vi.mocked(authApi.logout).mockResolvedValue(undefined);
    renderPage();
    const user = userEvent.setup();
    await user.click(
      await screen.findByRole("button", { name: /se déconnecter/i })
    );
    expect(await screen.findByText(/login:/)).toBeInTheDocument();
    expect(authApi.logout).toHaveBeenCalled();
  });

  it("revient sur /login meme si POST /logout echoue", async () => {
    vi.mocked(authApi.getMe).mockResolvedValue(ME);
    vi.mocked(authApi.logout).mockRejectedValue(
      new authApi.ApiError(500, "boom")
    );
    renderPage();
    const user = userEvent.setup();
    await user.click(
      await screen.findByRole("button", { name: /se déconnecter/i })
    );
    expect(await screen.findByText(/login:/)).toBeInTheDocument();
  });
});
