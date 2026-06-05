import { Button, Feedback, TextField } from "@custhome/ui";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError, register } from "../api/auth";

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
          autoComplete="new-password"
          helperText="8 caractères minimum"
          required
        />
        <TextField
          label="Confirmation du mot de passe"
          type="password"
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
          required
        />
        <Feedback error={error} />
        <Button type="submit" loading={loading} fullWidth>
          Créer le compte
        </Button>
      </form>
      <nav className="links">
        <Link to="/login">Déjà un compte ? Se connecter</Link>
      </nav>
    </>
  );
}
