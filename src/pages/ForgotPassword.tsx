import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/auth";
import Feedback from "../components/Feedback";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
    } finally {
      // L'API repond toujours 202 (anti-enumeration) : message identique quoi qu'il arrive.
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
          <button type="submit" disabled={loading}>
            {loading ? "Envoi..." : "Envoyer le lien"}
          </button>
        </form>
      )}
      <nav className="links">
        <Link to="/login">Retour à la connexion</Link>
      </nav>
    </>
  );
}
