# Creation des US du sprint 1 "Portail Auth - Front de base" (board 1, sprint 39).
# Usage : .\create-us-sprint1.ps1 -From 0 -To 0   (test sur la premiere US)
#         .\create-us-sprint1.ps1 -From 1 -To 7   (le reste)
param([int]$From = 0, [int]$To = 7)

$SPRINT_FIELD = "customfield_10020"
$SPRINT_ID = 39
$PROJECT = "SCRUM"

$tickets = @(
    @{
        Summary = "[US-00] Mise en place du projet (React + Node.js)"
        Labels = @("portail-authenticator", "setup")
        Story = "En tant qu'equipe, je veux un projet front initialise et structure afin de developper le portail d'authentification sur des bases saines."
        Criteria = @(
            "Monorepo npm workspaces : client/ (React + Vite + TypeScript) et server/ (Express + TypeScript)",
            "Scripts racine : dev (Vite :3000), build (client puis serveur), start (serveur Node :3000)",
            "Configuration par variables d'environnement : PORT (3000) et GATEWAY_URL (http://localhost:8080), .env.example commite",
            "README decrivant l'architecture (Gateway -> portail -> /api/auth) et le demarrage",
            "npm run build vert, GET /health -> 200 {status, service}"
        )
    },
    @{
        Summary = "[US-01] Serveur Node : service du front et proxy /api vers le Gateway"
        Labels = @("portail-authenticator", "server", "gateway")
        Story = "En tant que portail, je veux servir le front et relayer tous les appels API vers le Gateway afin de rester same-origin et de ne jamais exposer l'Authenticator directement."
        Criteria = @(
            "Le serveur Express sert le build React (client/dist) avec fallback SPA (react-router)",
            "Tout /api/* est proxifie vers GATEWAY_URL (http-proxy-middleware, X-Forwarded-* transmis)",
            "Les cookies HttpOnly ch_token / ch_refresh poses par l'Authenticator transitent sans manipulation cote front",
            "GET /health repond localement (jamais proxifie)",
            "En dev, le proxy Vite reproduit le meme comportement (/api -> Gateway)"
        )
    },
    @{
        Summary = "[US-02] Page de connexion avec retour vers la page demandee"
        Labels = @("portail-authenticator", "login")
        Story = "En tant qu'utilisateur redirige par le Gateway (302 vers auth_front_url?redirect=...), je veux me connecter puis revenir automatiquement sur la page que je demandais."
        Criteria = @(
            "Formulaire email + mot de passe -> POST /api/auth/login",
            "Succes : redirection vers ?redirect= si present, sinon /account",
            "Anti open-redirect : seuls les chemins relatifs internes sont acceptes (rejet de //, http://...)",
            "Echec : message generique 'Email ou mot de passe incorrect' sans distinguer la cause",
            "Liens vers /register et /forgot-password"
        )
    },
    @{
        Summary = "[US-03] Page de creation de compte"
        Labels = @("portail-authenticator", "register")
        Story = "En tant que nouvel utilisateur, je veux creer un compte depuis le portail afin d'acceder aux services CustHome."
        Criteria = @(
            "Formulaire email + mot de passe + confirmation -> POST /api/auth/register",
            "Validation cote client : format email, mot de passe >= 8 caracteres, confirmation identique",
            "409 (email deja pris) -> message dedie ; autres erreurs -> message generique",
            "Succes : redirection vers /login"
        )
    },
    @{
        Summary = "[US-04] Page mot de passe oublie"
        Labels = @("portail-authenticator", "reset-password")
        Story = "En tant qu'utilisateur ayant oublie mon mot de passe, je veux demander un lien de reinitialisation depuis le portail."
        Criteria = @(
            "Formulaire email -> POST /api/auth/password/forgot",
            "Message de confirmation identique que l'email existe ou non (anti-enumeration, l'API repond toujours 202)",
            "Lien de retour vers /login"
        )
    },
    @{
        Summary = "[US-05] Page de reinitialisation du mot de passe"
        Labels = @("portail-authenticator", "reset-password")
        Story = "En tant qu'utilisateur, je veux definir un nouveau mot de passe depuis le lien recu par email afin de recuperer mon compte."
        Criteria = @(
            "Route /reset-password?token=... (cible de password_reset.url de l'Authenticator)",
            "Token absent -> message d'erreur et lien vers une nouvelle demande",
            "Formulaire nouveau mot de passe + confirmation (>= 8 caracteres) -> POST /api/auth/password/reset {token, new_password}",
            "400 (token expire / deja utilise / inconnu) -> message generique 'lien invalide ou expire'",
            "Succes : redirection vers /login"
        )
    },
    @{
        Summary = "[US-06] Page Mon compte et deconnexion"
        Labels = @("portail-authenticator", "profil")
        Story = "En tant qu'utilisateur connecte, je veux consulter mon profil et me deconnecter depuis le portail."
        Criteria = @(
            "GET /api/auth/me au chargement -> affichage email, roles par portail, date de creation",
            "401 -> redirection vers /login?redirect=/account",
            "Bouton de deconnexion -> POST /api/auth/logout (cookies expires par l'Authenticator) puis retour /login",
            "Le front ne lit ni ne stocke jamais de token (cookies HttpOnly uniquement)"
        )
    },
    @{
        Summary = "[US-07] Integration Gateway de bout en bout"
        Labels = @("portail-authenticator", "gateway", "tests")
        Story = "En tant qu'equipe, je veux valider le parcours complet a travers le Gateway afin de garantir que le portail joue son role de point d'entree d'authentification."
        Criteria = @(
            "auth_front_url du Gateway pointe vers le portail (http://localhost:3000/login) - config verifiee",
            "Parcours navigateur : requete protegee sans token -> 302 Gateway -> /login?redirect= -> login -> retour sur la ressource avec cookie ch_token",
            "Parcours reset complet : forgot -> lien (mailer dev) -> reset -> login avec le nouveau mot de passe",
            "Parcours compte : login -> /account (me) -> logout -> /account redirige vers /login",
            "Procedure de test documentee dans le README (stack locale : Gateway 8080, Authenticator 8081, portail 3000)"
        )
    }
)

function New-AdfDescription($story, $criteria) {
    $bullets = @($criteria | ForEach-Object {
        @{ type = "listItem"; content = @(@{ type = "paragraph"; content = @(@{ type = "text"; text = $_ }) }) }
    })
    return @{
        type = "doc"; version = 1
        content = @(
            @{ type = "paragraph"; content = @(@{ type = "text"; text = $story; marks = @(@{ type = "em" }) }) },
            @{ type = "heading"; attrs = @{ level = 3 }; content = @(@{ type = "text"; text = "Criteres d'acceptation" }) },
            @{ type = "bulletList"; content = $bullets }
        )
    }
}

for ($i = $From; $i -le $To; $i++) {
    $t = $tickets[$i]
    $payload = @{
        projectKey = $PROJECT
        type = "Story"
        summary = $t.Summary
        labels = $t.Labels
        description = New-AdfDescription $t.Story $t.Criteria
        additionalAttributes = @{ $SPRINT_FIELD = $SPRINT_ID }
    }
    $file = Join-Path $PSScriptRoot ("us1-{0:d2}.json" -f $i)
    $payload | ConvertTo-Json -Depth 20 | Out-File $file -Encoding ascii
    Write-Host "--- Creation $($t.Summary)"
    acli jira workitem create --from-json $file
    if (-not $?) { Write-Host "ECHEC sur l'index $i" -ForegroundColor Red; exit 1 }
    Remove-Item $file
}
