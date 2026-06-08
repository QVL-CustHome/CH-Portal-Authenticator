import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Providers } from "../../test/Providers";
import ForgotPassword from "../ForgotPassword";
import * as authApi from "../../api/auth";

vi.mock("../../api/auth", { spy: true });

const MESSAGE =
  "Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé.";

function renderPage() {
  return render(
    <Providers>
      <MemoryRouter initialEntries={["/forgot-password"]}>
        <ForgotPassword />
      </MemoryRouter>
    </Providers>
  );
}

async function submit(email = "a@b.fr") {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/email/i), email);
  await user.click(screen.getByRole("button", { name: /envoyer le lien/i }));
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("page ForgotPassword", () => {
  it("envoie la demande et affiche le message de confirmation", async () => {
    vi.mocked(authApi.forgotPassword).mockResolvedValue({});
    renderPage();
    await submit();
    expect(await screen.findByText(MESSAGE)).toBeInTheDocument();
    expect(authApi.forgotPassword).toHaveBeenCalledWith("a@b.fr");
  });

  it("affiche le meme message si l'API echoue (anti-enumeration)", async () => {
    vi.mocked(authApi.forgotPassword).mockRejectedValue(
      new authApi.ApiError(500, "boom")
    );
    renderPage();
    await submit();
    expect(await screen.findByText(MESSAGE)).toBeInTheDocument();
  });

  it("masque le formulaire apres envoi", async () => {
    vi.mocked(authApi.forgotPassword).mockResolvedValue({});
    renderPage();
    await submit();
    await screen.findByText(MESSAGE);
    expect(
      screen.queryByRole("button", { name: /envoyer le lien/i })
    ).not.toBeInTheDocument();
  });

  it("propose le retour vers /login", () => {
    renderPage();
    expect(
      screen.getByRole("link", { name: /retour à la connexion/i })
    ).toHaveAttribute("href", "/login");
  });
});
