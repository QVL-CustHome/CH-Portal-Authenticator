import { useState } from "react";
import { forgotPassword } from "../api/auth";

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    await forgotPassword(email).catch(() => undefined);
    setSent(true);
    setLoading(false);
  }

  return { email, setEmail, sent, loading, submit };
}
