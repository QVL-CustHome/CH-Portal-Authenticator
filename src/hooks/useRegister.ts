import { PASSWORD_MIN_LENGTH, useTranslation } from "@custhome/ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError, register } from "../api/auth";
import { TERMS_VERSION } from "../lib/termsVersion";

export function useRegister() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function acceptTerms(checked: boolean) {
    setTermsAccepted(checked);
    if (checked) setTermsError(null);
  }

  function mapRegisterError(err: unknown) {
    if (err instanceof ApiError && err.status === 422) {
      if (err.code === "terms_version_mismatch") {
        setTermsError(t("auth.register.terms.versionMismatch"));
        return;
      }
      if (err.code === "terms_not_accepted") {
        setTermsError(t("auth.register.terms.required"));
        return;
      }
    }
    setError(
      err instanceof ApiError && err.status === 409
        ? t("auth.register.conflict")
        : t("auth.register.error")
    );
  }

  async function submit() {
    setError(null);
    setTermsError(null);
    if (name.trim() === "") {
      setError(t("auth.register.nameRequired"));
      return;
    }
    if (password !== confirm) {
      setError(t("auth.passwordMismatch"));
      return;
    }
    if (password.length < PASSWORD_MIN_LENGTH) {
      setError(t("ch.validation.passwordMin", { min: PASSWORD_MIN_LENGTH }));
      return;
    }
    if (!termsAccepted) {
      setTermsError(t("auth.register.terms.required"));
      return;
    }
    setLoading(true);
    try {
      await register(name.trim(), email, password, TERMS_VERSION);
      navigate("/login", { replace: true });
    } catch (err) {
      mapRegisterError(err);
      setLoading(false);
    }
  }

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirm,
    setConfirm,
    termsAccepted,
    acceptTerms,
    termsError,
    submitDisabled: !termsAccepted,
    error,
    loading,
    submit,
  };
}
