import {
  Checkbox,
  Feedback,
  Form,
  InputEmail,
  InputPassword,
  InputText,
  NAME_REGEX,
  PageContent,
  Spinner,
  useTranslation,
} from "@custhome/ui";
import { useEffect, useState } from "react";
import AuthNav from "../components/AuthNav";
import AppLink from "../components/AppLink";
import { getRegistrationEnabled } from "../api/auth";
import { useRegister } from "../hooks/useRegister";

export default function Register() {
  const { t } = useTranslation();
  const [registrationEnabled, setRegistrationEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    getRegistrationEnabled()
      .then((res) => {
        if (active) setRegistrationEnabled(res.enabled);
      })
      .catch(() => {
        if (active) setRegistrationEnabled(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const {
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
    submitDisabled,
    error,
    loading,
    submit,
  } = useRegister();
  return (
    <PageContent
      title={t("auth.register.title")}
      footer={<AuthNav links={[{ to: "/login", label: t("auth.link.haveAccount") }]} />}
    >
      {registrationEnabled === null ? (
        <Spinner />
      ) : !registrationEnabled ? (
        <Feedback severity="info">{t("auth.register.disabled")}</Feedback>
      ) : (
        <Form
          onSubmit={submit}
          submitLabel={t("auth.register.submit")}
          loading={loading}
          submitDisabled={submitDisabled}
          error={error}
        >
        <InputText
          label={t("auth.field.name")}
          value={name}
          onChange={setName}
          required
          pattern={NAME_REGEX}
          patternMessage={t("auth.field.nameInvalid")}
        />
        <InputEmail label={t("auth.field.email")} value={email} onChange={setEmail} required />
        <InputPassword
          label={t("auth.field.password")}
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          helperText={t("auth.field.passwordHint")}
          required
        />
        <InputPassword
          label={t("auth.field.passwordConfirm")}
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
          required
        />
        <Checkbox
          checked={termsAccepted}
          onChange={acceptTerms}
          required
          error={termsError}
          label={
            <>
              {t("auth.register.terms.intro")}{" "}
              <AppLink to="/cgu" newTab>
                {t("auth.register.terms.linkText")}
              </AppLink>
            </>
          }
        />
        </Form>
      )}
    </PageContent>
  );
}
