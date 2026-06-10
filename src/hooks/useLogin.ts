import { useTranslation } from "@custhome/ui";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ApiError, login } from "../api/auth";
import { navigateTo } from "../lib/navigation";
import { safeRedirect } from "../lib/redirect";

export function useLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigateTo(safeRedirect(searchParams.get("redirect")));
    } catch (err) {
      if (err instanceof ApiError && err.message === "account_pending") {
        navigate("/pending");
        return;
      }
      if (err instanceof ApiError && err.message === "account_disabled") {
        setError(t("auth.login.accountDisabled"));
      } else {
        setError(t("auth.login.error"));
      }
      setLoading(false);
    }
  }

  return { email, setEmail, password, setPassword, error, loading, submit };
}
