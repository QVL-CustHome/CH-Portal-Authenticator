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

## Sprint en cours

Sprint 1 « front de base » : fonctionnel sans habillage graphique.
Le sprint 2 portera sur le design (charte, composants, responsive).
