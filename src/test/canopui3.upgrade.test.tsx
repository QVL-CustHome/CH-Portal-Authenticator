import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import {
  CanopApiError,
  CanopI18nProvider,
  CanopThemeProvider,
  PASSWORD_MIN_LENGTH,
} from "canopui";
import { Providers } from "./Providers";
import App from "../App";
import LegalLinks from "../components/LegalLinks";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";
import Account from "../pages/Account";
import * as authApi from "../api/auth";
import { messages } from "../i18n/messages";
import * as navigation from "../lib/navigation";

vi.mock("../api/auth", { spy: true });
vi.mock("../lib/navigation", { spy: true });

const passwordTooShort = "Ab1!".padEnd(PASSWORD_MIN_LENGTH - 1, "x");
const passwordMinMessage = `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères.`;

function renderWithRoutes(url: string, routes: Record<string, ReactNode>) {
  return render(
    <Providers>
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          {Object.entries(routes).map(([path, element]) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </MemoryRouter>
    </Providers>
  );
}

function renderLogin() {
  return renderWithRoutes("/login", {
    "/login": <Login />,
    "/pending": <p>page pending</p>,
  });
}

async function submitLogin() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/email/i), "a@b.fr");
  await user.type(screen.getByLabelText(/mot de passe/i), "secret123");
  await user.click(screen.getByRole("button", { name: /se connecter/i }));
}

function rejectLoginWith(code: string | undefined) {
  vi.mocked(authApi.login).mockRejectedValue(new CanopApiError(403, "refus", code));
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(navigation.navigateTo).mockImplementation(() => {});
  vi.mocked(authApi.getRegistrationEnabled).mockResolvedValue({ enabled: true });
});

describe("accessibilite des navigations et du chargement", () => {
  it("expose la navigation d'authentification sous son nom accessible", () => {
    render(
      <Providers>
        <MemoryRouter initialEntries={["/login"]}>
          <App />
        </MemoryRouter>
      </Providers>
    );
    expect(
      screen.getByRole("navigation", { name: "Navigation d'authentification" })
    ).toBeInTheDocument();
  });

  it("nomme la navigation legale par auth.legal.footerLabel", () => {
    render(
      <Providers>
        <MemoryRouter>
          <LegalLinks />
        </MemoryRouter>
      </Providers>
    );
    expect(
      screen.getByRole("navigation", { name: "Liens légaux" })
    ).toBeInTheDocument();
  });

  it("nomme le spinner d'Account par auth.loading pendant le chargement", () => {
    vi.mocked(authApi.getMe).mockReturnValue(new Promise(() => {}));
    const accountLoadingLabel = "Chargement du compte";
    render(
      <CanopI18nProvider
        locale="fr"
        messages={{ ...messages, fr: { ...messages.fr, "auth.loading": accountLoadingLabel } }}
      >
        <CanopThemeProvider>
          <MemoryRouter initialEntries={["/account"]}>
            <Account />
          </MemoryRouter>
        </CanopThemeProvider>
      </CanopI18nProvider>
    );
    expect(screen.getByLabelText(accountLoadingLabel)).toBeInTheDocument();
  });
});

describe("codes d'erreur de connexion", () => {
  it("account_pending redirige vers /pending", async () => {
    rejectLoginWith("account_pending");
    renderLogin();
    await submitLogin();
    expect(await screen.findByText("page pending")).toBeInTheDocument();
  });

  it("account_disabled affiche le message de compte desactive", async () => {
    rejectLoginWith("account_disabled");
    renderLogin();
    await submitLogin();
    expect(
      await screen.findByText("Ce compte a été désactivé. Contactez un administrateur.")
    ).toBeInTheDocument();
  });

  it("device_not_allowed affiche le message d'appareil non autorise", async () => {
    rejectLoginWith("device_not_allowed");
    renderLogin();
    await submitLogin();
    expect(
      await screen.findByText("Vous n'êtes pas autorisé à vous connecter avec cet appareil.")
    ).toBeInTheDocument();
  });

  it.each([undefined, "code_inconnu"])(
    "un code %s retombe sur auth.login.error",
    async (code) => {
      rejectLoginWith(code);
      renderLogin();
      await submitLogin();
      expect(
        await screen.findByText("Email ou mot de passe incorrect.")
      ).toBeInTheDocument();
      expect(screen.queryByText("page pending")).not.toBeInTheDocument();
    }
  );
});

describe("mot de passe trop court", () => {
  it("l'inscription affiche canop.validation.passwordMin avec {min} interpole", async () => {
    renderWithRoutes("/register", { "/register": <Register /> });
    const user = userEvent.setup({ delay: null });
    await user.type(await screen.findByLabelText(/^nom/i), "Martin");
    await user.type(screen.getByLabelText(/^email/i), "nouveau@custhome.fr");
    await user.type(screen.getByLabelText(/^mot de passe/i), passwordTooShort);
    await user.type(screen.getByLabelText(/confirmation/i), passwordTooShort);
    await user.click(screen.getByRole("checkbox", { name: /j'ai lu et j'accepte les/i }));
    await user.click(screen.getByRole("button", { name: /créer le compte/i }));
    expect(await screen.findByText(passwordMinMessage)).toBeInTheDocument();
    expect(screen.queryByText(/\{min\}/)).not.toBeInTheDocument();
    expect(authApi.register).not.toHaveBeenCalled();
  }, 15000);

  it("la reinitialisation affiche canop.validation.passwordMin avec {min} interpole", async () => {
    renderWithRoutes("/reset-password?token=tok-123", {
      "/reset-password": <ResetPassword />,
    });
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/nouveau mot de passe/i), passwordTooShort);
    await user.type(screen.getByLabelText(/confirmation/i), passwordTooShort);
    await user.click(screen.getByRole("button", { name: /définir le mot de passe/i }));
    expect(await screen.findByText(passwordMinMessage)).toBeInTheDocument();
    expect(screen.queryByText(/\{min\}/)).not.toBeInTheDocument();
    expect(authApi.resetPassword).not.toHaveBeenCalled();
  });
});
