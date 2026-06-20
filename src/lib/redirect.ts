import { REDIRECT_INTENT_PARAM } from "@custhome/ui";

const DEFAULT_TRUSTED_ORIGINS =
  "http://localhost:3201,http://localhost:3202,http://[::1]:3201,http://[::1]:3202";

const trustedOrigins = (
  import.meta.env.VITE_TRUSTED_REDIRECT_ORIGINS ?? DEFAULT_TRUSTED_ORIGINS
)
  .split(",")
  .map((origin: string) => origin.trim())
  .filter(Boolean);

function clearRedirectCookie(): void {
  document.cookie = "ch_redirect=; path=/; max-age=0";
}

function hasRedirectIntent(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.get(REDIRECT_INTENT_PARAM) === "1";
}

export function getRedirectTarget(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)ch_redirect=([^;]*)/);
  if (!match) return null;
  clearRedirectCookie();
  if (!hasRedirectIntent()) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

export function safeRedirect(raw: string | null): string {
  if (!raw) return "/account";

  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;

  try {
    const url = new URL(raw);
    const isHttp = url.protocol === "http:" || url.protocol === "https:";
    if (isHttp && trustedOrigins.includes(url.origin)) return url.href;
  } catch {

  }

  return "/account";
}
