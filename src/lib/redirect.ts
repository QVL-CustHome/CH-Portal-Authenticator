// Cible de redirection après login (anti open-redirect). Sont acceptés :
// - les chemins relatifs internes (même origine) ;
// - les URL absolues vers une origine de portail DE CONFIANCE uniquement.
// L'allowlist est surchargeable via VITE_TRUSTED_REDIRECT_ORIGINS (CSV) ; ce
// mécanisme est commun à tous les portails : chacun appelle
// `…/login?redirect=<son URL>`, le portail d'auth renvoie l'utilisateur chez lui.
// Toute autre cible retombe sur /account.
const DEFAULT_TRUSTED_ORIGINS = "http://localhost:3201";

const trustedOrigins = (
  import.meta.env.VITE_TRUSTED_REDIRECT_ORIGINS ?? DEFAULT_TRUSTED_ORIGINS
)
  .split(",")
  .map((origin: string) => origin.trim())
  .filter(Boolean);

export function safeRedirect(raw: string | null): string {
  if (!raw) return "/account";

  // Chemin relatif interne (jamais protocol-relative "//").
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;

  // URL absolue : autorisée seulement vers un portail de confiance.
  try {
    const url = new URL(raw);
    const isHttp = url.protocol === "http:" || url.protocol === "https:";
    if (isHttp && trustedOrigins.includes(url.origin)) return url.href;
  } catch {
    // pas une URL valide
  }

  return "/account";
}
