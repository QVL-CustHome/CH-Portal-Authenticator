import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/auth";
import Feedback from "../components/Feedback";

// Page cible du lien email (password_reset.url = /reset-password?token=...).
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <>
        <h2>Réinitialisation du mot de passe</h2>
        <Feedback error="Lien invalide : token manquant. Refaites une demande de réinitialisation." />
        <nav className="links">
          <Link to="/forgot-password">Nouvelle demande</Link>
        </nav>
      </>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      navigate("/login", { replace: true });
    } catch {
      // 400 generique cote API (token expire, deja utilise ou inconnu)
      setError("Le lien est invalide ou expiré. Refaites une demande.");
      setLoading(false);
    }
  }

  return (
    <>
      <h2>Réinitialisation du mot de passe</h2>
      <form onSubmit={onSubmit}>
        <label>
          Nouveau mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
        <label>
          Confirmation
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
        <Feedback error={error} />
        <button type="submit" disabled={loading}>
          {loading ? "Enregistrement..." : "Définir le mot de passe"}
        </button>
      </form>
      <nav className="links">
        <Link to="/login">Retour à la connexion</Link>
      </nav>
    </>
  );
}
