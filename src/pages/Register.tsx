import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError, register } from "../api/auth";
import Feedback from "../components/Feedback";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      await register(email, password);
      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 409
          ? "Un compte existe déjà avec cet email."
          : "L'inscription a échoué. Réessayez."
      );
      setLoading(false);
    }
  }

  return (
    <>
      <h2>Créer un compte</h2>
      <form onSubmit={onSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label>
          Mot de passe
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
          Confirmation du mot de passe
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
          {loading ? "Création..." : "Créer le compte"}
        </button>
      </form>
      <nav className="links">
        <Link to="/login">Déjà un compte ? Se connecter</Link>
      </nav>
    </>
  );
}
