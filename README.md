# CH-Portail-Authenticator

Portail d'authentification CustHome : front **React** servi par un serveur **Node.js**, intégré derrière **CH-Api-GateWay** et adossé à **CH-Api-Authenticator**.

## Rôle dans l'architecture

```
Navigateur ──► CH-Api-GateWay (:8080)
                 │  requête protégée sans token + Accept: text/html
                 │  └─► 302 vers auth_front_url = http://localhost:3000/login?redirect=<URI>
                 ▼
        CH-Portail-Authenticator (:3000)
                 │  /api/* proxifié vers le Gateway (same-origin → cookies HttpOnly)
                 ▼
        CH-Api-GateWay /api/auth/* ──► CH-Api-Authenticator (:8081)
```

- Le Gateway redirige les navigateurs non authentifiés vers ce portail (`auth_front_url`).
- Le portail ne parle **jamais** directement à l'Authenticator : tous les appels passent par le Gateway (`/api/auth/*`).
- Les tokens sont des cookies HttpOnly (`ch_token`, `ch_refresh`) posés par l'Authenticator — le front ne manipule aucun token.
- Après login, le portail renvoie l'utilisateur vers la page demandée (`?redirect=`, chemins relatifs uniquement).

## Structure

```
src/         Front React (Vite + TypeScript, react-router)
  api/       Client API (/api/auth/* via le Gateway)
  pages/     Login, Register, ForgotPassword, ResetPassword, Account
  components/
server.js    Serveur Node.js (Express) :
             - sert le build (dist/) sur :3000
             - proxifie /api → GATEWAY_URL
             - GET /health
```

## Pages

| Route              | Rôle                                                        |
|--------------------|-------------------------------------------------------------|
| `/login`           | Connexion (gère `?redirect=` envoyé par le Gateway)         |
| `/register`        | Création de compte                                          |
| `/forgot-password` | Demande de réinitialisation (réponse anti-énumération)      |
| `/reset-password`  | Cible du lien email (`?token=`), définition du nouveau mdp  |
| `/account`         | Profil (`GET /me`), déconnexion                             |

## Démarrage

Prérequis : Node.js ≥ 20, CH-Api-GateWay sur `:8080`, CH-Api-Authenticator sur `:8081`.

```bash
npm install

# Dev : Vite sur :3000, /api proxifié vers le Gateway
npm run dev

# Prod : build puis serveur Node sur :3000
npm run build
npm start
```

## Configuration

Variables d'environnement du serveur (voir `.env.example`) :

| Variable      | Défaut                  | Rôle                                |
|---------------|-------------------------|-------------------------------------|
| `PORT`        | `3000`                  | Port d'écoute (cf. `auth_front_url`)|
| `GATEWAY_URL` | `http://localhost:8080` | Cible du proxy `/api`               |

## Tests

```bash
npm test          # suite unitaire (Vitest + Testing Library + Supertest)
npm run coverage  # avec couverture (seuils : 80 %)
```

- `app.test.js` : serveur Express (`/health` local, proxy `/api` avec chemin complet conservé, transit des `Set-Cookie`, fichiers statiques, fallback SPA)
- `src/**/*.test.ts(x)` : client API, anti open-redirect, et les 5 pages (rendu, validation, erreurs, redirections)

## Test d'intégration de bout en bout (US-07)

Stack locale : MongoDB, puis CH-Api-Authenticator (`cargo run`, :8081), CH-Api-GateWay (`go run ./cmd/gateway`, :8080), portail (`npm run build && npm start`, :3000). Vérifier `auth_front_url: http://localhost:3000/login` dans le `config.yaml` du Gateway.

Parcours validés (2026-06-04) :

1. **Redirection navigateur** — `GET :8080/api/users/1` avec `Accept: text/html` sans token
   → `302 Location: http://localhost:3000/login?redirect=%2Fapi%2Fusers%2F1`
2. **Compte** — register `201` → login `200` (cookies `ch_token` + `ch_refresh`) → `GET /me` `200` → logout `200` → `GET /me` `401`
3. **Reset** — forgot `202` (lien loggé par le mailer dev vers `:3000/reset-password?token=…`) → reset `200` → login ancien mdp `401`, nouveau mdp `200`, token réutilisé `400`

Tous les appels passent par le portail (`:3000/api/...` → Gateway → Authenticator).

## Sprint en cours

Sprint 1 « front de base » : fonctionnel sans habillage graphique.
Le sprint 2 portera sur le design (charte, composants, responsive).
