// N'accepte que des chemins relatifs internes pour eviter tout open redirect
// (le Gateway envoie ?redirect=<URI demandee> lors d'un 401 navigateur).
export function safeRedirect(raw: string | null): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return "/account";
}
