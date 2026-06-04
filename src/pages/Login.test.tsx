import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import * as authApi from "../api/auth";
import * as navigation from "../lib/navigation";

vi.mock("../api/auth", { spy: true });
vi.mock("../lib/navigation", { spy: true });

function renderLogin(url = "/login") {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Login />
    </MemoryRouter>
  );
}

async function fillAndSubmit() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/email/i), "a@b.fr");
  await user.type(screen.getByLabelText(/mot de passe/i), "secret123");
  await user.click(screen.getByRole("button", { name: /se connecter/i }));
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(navigation.navigateTo).mockImplementation(() => {});
});

describe("page Login", () => {
  it("connecte puis redirige vers ?redirect= (chemin interne)", async () => {
    vi.mocked(authApi.login).mockResolvedValue({});
    renderLogin("/login?redirect=/api/users/42");
    await fillAndSubmit();
    await waitFor(() => {
      expect(navigation.navigateTo).toHaveBeenCalledWith("/api/users/42");
    });
    expect(authApi.login).toHaveBeenCalledWith("a@b.fr", "secret123");
  });

  it("redirige vers /account sans parametre redirect", async () => {
    vi.mocked(authApi.login).mockResolvedValue({});
    renderLogin();
    await fillAndSubmit();
    await waitFor(() => {
      expect(navigation.navigateTo).toHaveBeenCalledWith("/account");
    });
  });

  it("neutralise un redirect externe (open redirect)", async () => {
    vi.mocked(authApi.login).mockResolvedValue({});
    renderLogin("/login?redirect=https://evil.example");
    await fillAndSubmit();
    await waitFor(() => {
      expect(navigation.navigateTo).toHaveBeenCalledWith("/account");
    });
  });

  it("affiche un message generique en cas d'echec", async () => {
    vi.mocked(authApi.login).mockRejectedValue(
      new authApi.ApiError(401, "invalid credentials")
    );
    renderLogin();
    await fillAndSubmit();
    expect(
      await screen.findByText("Email ou mot de passe incorrect.")
    ).toBeInTheDocument();
    expect(navigation.navigateTo).not.toHaveBeenCalled();
  });

  it("propose les liens inscription et mot de passe oublie", () => {
    renderLogin();
    expect(
      screen.getByRole("link", { name: /mot de passe oublié/i })
    ).toHaveAttribute("href", "/forgot-password");
    expect(
      screen.getByRole("link", { name: /créer un compte/i })
    ).toHaveAttribute("href", "/register");
  });
});
