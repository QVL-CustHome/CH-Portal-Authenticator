import { Button, Feedback, TextField } from "@custhome/ui";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
    } catch {
      // Message identique quoi qu'il arrive (anti-enumeration, l'API repond toujours 202).
    } finally {
      setSent(true);
      setLoading(false);
    }
  }

  return (
    <>
      <h2>Mot de passe oublié</h2>
      {sent ? (
        <Feedback info="Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé." />
      ) : (
        <form onSubmit={onSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
          />
          <Button type="submit" loading={loading} fullWidth>
            Envoyer le lien
          </Button>
        </form>
      )}
      <nav className="links">
        <Link to="/login">Retour à la connexion</Link>
      </nav>
    </>
  );
}
