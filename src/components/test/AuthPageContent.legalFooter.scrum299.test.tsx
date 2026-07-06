import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ChI18nProvider, ChThemeProvider } from "@custhome/ui";
import { defaultLocale, messages } from "../../i18n/messages";
import AuthPageContent from "../AuthPageContent";

if (!("ResizeObserver" in globalThis)) {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}

const CGU_LABEL = /conditions g[ée]n[ée]rales d'utilisation/i;
const NOTICE_LABEL = /^mentions l[ée]gales$/i;
const LEGAL_INFO_LABEL = /informations l[ée]gales/i;

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function renderContent() {
  return render(
    <ChI18nProvider locale={defaultLocale} messages={messages}>
      <ChThemeProvider>
        <MemoryRouter>
          <AuthPageContent title="Connexion">
            <p>contenu</p>
          </AuthPageContent>
        </MemoryRouter>
      </ChThemeProvider>
    </ChI18nProvider>,
  );
}

describe("Authenticator - aucun footer legal (SCRUM-299)", () => {
  describe("desktop (>48rem)", () => {
    beforeEach(() => {
      mockMatchMedia(false);
    });

    it("n'affiche aucun lien CGU ni mentions legales", () => {
      renderContent();
      expect(screen.queryByRole("link", { name: CGU_LABEL })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: NOTICE_LABEL })).not.toBeInTheDocument();
    });
  });

  describe("mobile (<=48rem)", () => {
    beforeEach(() => {
      mockMatchMedia(true);
    });

    it("n'expose aucun lien legal ni bouton d'informations legales dans le menu reglages", async () => {
      const user = userEvent.setup();
      renderContent();

      await user.click(screen.getByLabelText("Ouvrir le menu"));
      const menu = await screen.findByRole("presentation");

      expect(within(menu).queryByRole("link", { name: CGU_LABEL })).not.toBeInTheDocument();
      expect(within(menu).queryByRole("link", { name: NOTICE_LABEL })).not.toBeInTheDocument();
      expect(within(menu).queryByRole("link", { name: LEGAL_INFO_LABEL })).not.toBeInTheDocument();
    });
  });
});
