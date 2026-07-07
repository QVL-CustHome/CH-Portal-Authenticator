import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { buildLoginUrl, REDIRECT_INTENT_PARAM } from "canopui";
import { getRedirectTarget, safeRedirect } from "../redirect";

const AUTH_PORTAL_URL = "http://localhost:3200";

interface Portal {
  label: string;
  origin: string;
}

const DRIVE_LOCALHOST: Portal = {
  label: "Drive localhost",
  origin: "http://localhost:3201",
};
const ADMIN_LOCALHOST: Portal = {
  label: "Admin localhost",
  origin: "http://localhost:3202",
};
const DRIVE_IPV6: Portal = {
  label: "Drive [::1]",
  origin: "http://[::1]:3201",
};
const ADMIN_IPV6: Portal = {
  label: "Admin [::1]",
  origin: "http://[::1]:3202",
};

const PORTALS: Portal[] = [
  DRIVE_LOCALHOST,
  ADMIN_LOCALHOST,
  DRIVE_IPV6,
  ADMIN_IPV6,
];

function setLocation(href: string): void {
  const url = new URL(href);
  Object.defineProperty(window, "location", {
    writable: true,
    configurable: true,
    value: {
      href: url.href,
      search: url.search,
      origin: url.origin,
      assign: () => {},
    },
  });
}

function clearCookie(): void {
  document.cookie = "ch_redirect=; path=/; max-age=0";
}

function setResidualCookie(value: string): void {
  document.cookie = `ch_redirect=${encodeURIComponent(value)}; path=/`;
}

function businessPortalRequestsLogin(portalHref: string): string {
  setLocation(portalHref);
  return buildLoginUrl({ authPortalUrl: AUTH_PORTAL_URL });
}

function authenticatorResolvesAfterLogin(loginUrl: string): string {
  setLocation(loginUrl);
  return safeRedirect(getRedirectTarget());
}

beforeEach(() => {
  clearCookie();
});

afterEach(() => {
  clearCookie();
});

describe("SCRUM-192 SSO nominal : retour au portail d'origine apres login", () => {
  it.each(PORTALS)(
    "$label depose le cookie et le marqueur redirect=1 puis revient au portail d'origine",
    (portal) => {
      const portalHref = `${portal.origin}/files?folder=42`;
      const loginUrl = businessPortalRequestsLogin(portalHref);

      expect(
        new URLSearchParams(new URL(loginUrl).search).get(REDIRECT_INTENT_PARAM),
      ).toBe("1");

      expect(authenticatorResolvesAfterLogin(loginUrl)).toBe(portalHref);
    },
  );
});

describe("SCRUM-192 acces direct : cookie ch_redirect residuel ignore", () => {
  it.each(PORTALS)(
    "$label avec cookie residuel sans marqueur redirect=1 retombe sur /account",
    (portal) => {
      setResidualCookie(`${portal.origin}/files?folder=42`);
      setLocation(`${AUTH_PORTAL_URL}/login`);

      expect(safeRedirect(getRedirectTarget())).toBe("/account");
    },
  );
});
