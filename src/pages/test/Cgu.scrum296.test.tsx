import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Providers } from "../../test/Providers";
import App from "../../App";
import * as authApi from "../../api/auth";
import { messages } from "../../i18n/messages";
import { TERMS_VERSION, TERMS_VERSION_DATE } from "../../lib/termsVersion";

vi.mock("../../api/auth", { spy: true });

const fr = messages.fr as Record<string, string>;
const CGU_TITLE = fr["auth.cgu.title"];
const LEGAL_TITLE = fr["auth.legal.title"];
const LOGIN_TITLE = fr["auth.login.title"];
const FORMATTED_DATE = new Date(TERMS_VERSION_DATE).toLocaleDateString("fr-FR");
const VERSION_LABEL = fr["auth.cgu.versionLabel"]
  .replace("{version}", TERMS_VERSION)
  .replace("{date}", FORMATTED_DATE);

function renderApp(url: string) {
  return render(
    <Providers>
      <MemoryRouter initialEntries={[url]}>
        <App />
      </MemoryRouter>
    </Providers>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  HTMLElement.prototype.scrollIntoView = vi.fn();
});

describe("SCRUM-296 - page CGU + mentions legales (AC1)", () => {
  it("affiche les CGU et les mentions legales sur la meme page", async () => {
    renderApp("/cgu");
    expect(
      await screen.findByRole("heading", { name: CGU_TITLE })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: LEGAL_TITLE })
    ).toBeInTheDocument();
  });
});

describe("SCRUM-296 - route stable et ancre (AC2)", () => {
  it("la page est servie sur l'URL /cgu et non le fallback de connexion", async () => {
    renderApp("/cgu");
    expect(
      await screen.findByRole("heading", { name: CGU_TITLE })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: LOGIN_TITLE })
    ).not.toBeInTheDocument();
  });

  it("la section mentions legales est ciblable par l'ancre #mentions-legales", async () => {
    const { container } = renderApp("/cgu");
    await screen.findByRole("heading", { name: CGU_TITLE });
    const anchor = container.querySelector("#mentions-legales");
    expect(anchor).not.toBeNull();
    expect(within(anchor as HTMLElement).getByText(LEGAL_TITLE)).toBeInTheDocument();
  });

  it("l'URL /cgu#mentions-legales rend la page avec l'ancre presente", async () => {
    const { container } = renderApp("/cgu#mentions-legales");
    await screen.findByRole("heading", { name: CGU_TITLE });
    expect(container.querySelector("#mentions-legales")).not.toBeNull();
  });
});

describe("SCRUM-296 - consultation sans authentification (AC3)", () => {
  it("reste sur /cgu sans rediriger vers /login quand la session est absente (401)", async () => {
    vi.mocked(authApi.getMe).mockRejectedValue(
      new authApi.ApiError(401, "unauthorized")
    );
    renderApp("/cgu");
    expect(
      await screen.findByRole("heading", { name: CGU_TITLE })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: LOGIN_TITLE })
    ).not.toBeInTheDocument();
  });

  it("ne declenche aucun appel authentifie GET /me a l'affichage de la page", async () => {
    renderApp("/cgu");
    await screen.findByRole("heading", { name: CGU_TITLE });
    expect(authApi.getMe).not.toHaveBeenCalled();
  });
});

describe("SCRUM-296 - version et date des CGU (AC4)", () => {
  it("affiche la version v1 et sa date", async () => {
    renderApp("/cgu");
    await screen.findByRole("heading", { name: CGU_TITLE });
    expect(screen.getByText(VERSION_LABEL)).toBeInTheDocument();
    expect(TERMS_VERSION).toBe("v1");
  });
});
