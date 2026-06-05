import { Button, Feedback, Spinner } from "@custhome/ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError, getMe, logout, Me } from "../api/auth";

export default function Account() {
  const navigate = useNavigate();
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMe()
      .then(setMe)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          navigate("/login?redirect=/account", { replace: true });
        } else {
          setError("Impossible de charger le profil.");
        }
      });
  }, [navigate]);

  async function onLogout() {
    try {
      await logout();
    } catch {
      // On revient au login meme si l'API echoue : les cookies expireront cote serveur.
    } finally {
      navigate("/login", { replace: true });
    }
  }

  if (error) return <Feedback error={error} />;
  if (!me) return <Spinner label="Chargement" />;

  return (
    <>
      <h2>Mon compte</h2>
      <dl className="profile">
        <dt>Email</dt>
        <dd>{me.email}</dd>
        <dt>Rôles</dt>
        <dd>
          {Object.keys(me.roles).length === 0 ? (
            <em>Aucun rôle attribué</em>
          ) : (
            <ul>
              {Object.entries(me.roles).map(([portal, role]) => (
                <li key={portal}>
                  {portal} : {role}
                </li>
              ))}
            </ul>
          )}
        </dd>
        <dt>Compte créé le</dt>
        <dd>{new Date(me.created_at).toLocaleDateString("fr-FR")}</dd>
      </dl>
      <Button variant="secondary" onClick={onLogout}>
        Se déconnecter
      </Button>
    </>
  );
}
