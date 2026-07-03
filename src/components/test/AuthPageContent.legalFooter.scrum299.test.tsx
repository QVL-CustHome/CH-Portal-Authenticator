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

describe("Authenticator - footer legal (SCRUM-299)", () => {
  describe("AC1 desktop (>48rem)", () => {
    beforeEach(() => {
      mockMatchMedia(false);
    });

    it("affiche un footer avec les liens CGU et mentions legales", () => {
      renderContent();

      expect(screen.getByRole("link", { name: CGU_LABEL })).toBeVisible();
      expect(screen.getByRole("link", { name: NOTICE_LABEL })).toBeVisible();
    });
  });

  describe("AC2 mobile (<=48rem) - menu reglages", () => {
    beforeEach(() => {
      mockMatchMedia(true);
    });

    it("expose les deux liens legaux dans le menu reglages une fois ouvert", async () => {
      const user = userEvent.setup();
      renderContent();

      await user.click(screen.getByLabelText("Ouvrir le menu"));
      const menu = await screen.findByRole("presentation");

      expect(within(menu).getByRole("link", { name: CGU_LABEL })).toBeVisible();
      expect(within(menu).getByRole("link", { name: NOTICE_LABEL })).toBeVisible();
    });
  });

  describe("AC3 cibles internes", () => {
    beforeEach(() => {
      mockMatchMedia(false);
    });

    it("pointe vers les cibles internes /cgu et /cgu#mentions-legales", () => {
      renderContent();

      const cgu = screen.getByRole("link", { name: CGU_LABEL });
      const notice = screen.getByRole("link", { name: NOTICE_LABEL });

      expect(cgu).toHaveAttribute("href", "/cgu");
      expect(notice).toHaveAttribute("href", "/cgu#mentions-legales");
    });
  });
});
