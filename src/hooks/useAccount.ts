import { useTranslation } from "@custhome/ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError, getMe, logout, type Me } from "../api/auth";

export function useAccount() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMe()
      .then(setMe)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          navigate("/login?redirect=/account", { replace: true });
        } else {
          setError(t("auth.account.loadError"));
        }
      });
  }, [navigate, t]);

  async function signOut() {
    await logout().catch(() => undefined);
    navigate("/login", { replace: true });
  }

  return { me, error, signOut };
}
