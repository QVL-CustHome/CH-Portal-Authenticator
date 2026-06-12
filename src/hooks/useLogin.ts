import { useTranslation } from "@custhome/ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError, login } from "../api/auth";
import { navigateTo } from "../lib/navigation";
import { getRedirectTarget, safeRedirect } from "../lib/redirect";

export function useLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigateTo(safeRedirect(getRedirectTarget()));
    } catch (err) {
      if (err instanceof ApiError && err.message === "account_pending") {
        navigate("/pending");
        return;
      }
      if (err instanceof ApiError && err.message === "account_disabled") {
        setError(t("auth.login.accountDisabled"));
      } else if (err instanceof ApiError && err.message === "device_not_allowed") {
        setError(t("auth.login.deviceNotAllowed"));
      } else {
        setError(t("auth.login.error"));
      }
      setLoading(false);
    }
  }

  return { email, setEmail, password, setPassword, error, loading, submit };
}
