import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Providers } from "../../test/Providers";
import Register from "../Register";
import * as authApi from "../../api/auth";

vi.mock("../../api/auth", { spy: true });

function renderRegister() {
  return render(
    <Providers>
      <MemoryRouter initialEntries={["/register"]}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<p>page login</p>} />
        </Routes>
      </MemoryRouter>
    </Providers>
  );
}

async function fill(password: string, confirm = password) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/^email/i), "nouveau@custhome.fr");
  await user.type(screen.getByLabelText(/^mot de passe/i), password);
  await user.type(screen.getByLabelText(/confirmation/i), confirm);
  await user.click(screen.getByRole("button", { name: /créer le compte/i }));
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("page Register", () => {
  it("cree le compte puis redirige vers /login", async () => {
    vi.mocked(authApi.register).mockResolvedValue({});
    renderRegister();
    await fill("secret123");
    expect(await screen.findByText("page login")).toBeInTheDocument();
    expect(authApi.register).toHaveBeenCalledWith(
      "nouveau@custhome.fr",
      "secret123"
    );
  });

  it("bloque si les mots de passe different (sans appel API)", async () => {
    renderRegister();
    await fill("secret123", "autre-mdp");
    expect(
      await screen.findByText("Les mots de passe ne correspondent pas.")
    ).toBeInTheDocument();
    expect(authApi.register).not.toHaveBeenCalled();
  });

  it("message dedie sur 409 (email deja pris)", async () => {
    vi.mocked(authApi.register).mockRejectedValue(
      new authApi.ApiError(409, "conflict")
    );
    renderRegister();
    await fill("secret123");
    expect(
      await screen.findByText("Un compte existe déjà avec cet email.")
    ).toBeInTheDocument();
  });

  it("message generique sur les autres erreurs", async () => {
    vi.mocked(authApi.register).mockRejectedValue(
      new authApi.ApiError(500, "boom")
    );
    renderRegister();
    await fill("secret123");
    expect(
      await screen.findByText("L'inscription a échoué. Réessayez.")
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /créer le compte/i })
      ).toBeEnabled();
    });
  });
});
