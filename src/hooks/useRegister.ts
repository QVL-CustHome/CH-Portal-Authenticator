import { PASSWORD_MIN_LENGTH, useTranslation } from "@custhome/ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError, register } from "../api/auth";

export function useRegister() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError(null);
    if (password !== confirm) {
      setError(t("auth.passwordMismatch"));
      return;
    }
    if (password.length < PASSWORD_MIN_LENGTH) {
      setError(t("ch.validation.passwordMin", { min: PASSWORD_MIN_LENGTH }));
      return;
    }
    setLoading(true);
    try {
      await register(email, password);
      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 409
          ? t("auth.register.conflict")
          : t("auth.register.error")
      );
      setLoading(false);
    }
  }

  return { email, setEmail, password, setPassword, confirm, setConfirm, error, loading, submit };
}
