import { Button, Feedback, TextField } from "@custhome/ui";
import { FormEvent, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { login } from "../api/auth";
import { safeRedirect } from "../lib/redirect";
import { navigateTo } from "../lib/navigation";

export default function Login() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      // Cookies poses par l'Authenticator : on repart vers la page demandee.
      navigateTo(safeRedirect(searchParams.get("redirect")));
    } catch {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
    }
  }

  return (
    <>
      <h2>Connexion</h2>
      <form onSubmit={onSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          required
        />
        <TextField
          label="Mot de passe"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          required
        />
        <Feedback error={error} />
        <Button type="submit" loading={loading} fullWidth>
          Se connecter
        </Button>
      </form>
      <nav className="links">
        <Link to="/forgot-password">Mot de passe oublié ?</Link>
        <Link to="/register">Créer un compte</Link>
      </nav>
    </>
  );
}
