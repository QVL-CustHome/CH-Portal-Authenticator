import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ResetPassword from "./ResetPassword";
import * as authApi from "../api/auth";

vi.mock("../api/auth", { spy: true });

function renderPage(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/login" element={<p>page login</p>} />
      </Routes>
    </MemoryRouter>
  );
}

async function fill(password: string, confirm = password) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/nouveau mot de passe/i), password);
  await user.type(screen.getByLabelText(/confirmation/i), confirm);
  await user.click(
    screen.getByRole("button", { name: /définir le mot de passe/i })
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("page ResetPassword", () => {
  it("sans token : message d'erreur et lien vers une nouvelle demande", () => {
    renderPage("/reset-password");
    expect(screen.getByText(/token manquant/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /nouvelle demande/i })
    ).toHaveAttribute("href", "/forgot-password");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("reinitialise avec {token, new_password} puis redirige vers /login", async () => {
    vi.mocked(authApi.resetPassword).mockResolvedValue({});
    renderPage("/reset-password?token=tok-123");
    await fill("nouveau-mdp");
    expect(await screen.findByText("page login")).toBeInTheDocument();
    expect(authApi.resetPassword).toHaveBeenCalledWith(
      "tok-123",
      "nouveau-mdp"
    );
  });

  it("bloque si les mots de passe different (sans appel API)", async () => {
    renderPage("/reset-password?token=tok-123");
    await fill("nouveau-mdp", "autre-mdp");
    expect(
      await screen.findByText("Les mots de passe ne correspondent pas.")
    ).toBeInTheDocument();
    expect(authApi.resetPassword).not.toHaveBeenCalled();
  });

  it("message generique si le token est invalide ou expire (400)", async () => {
    vi.mocked(authApi.resetPassword).mockRejectedValue(
      new authApi.ApiError(400, "bad token")
    );
    renderPage("/reset-password?token=perime");
    await fill("nouveau-mdp");
    expect(
      await screen.findByText("Le lien est invalide ou expiré. Refaites une demande.")
    ).toBeInTheDocument();
  });
});
