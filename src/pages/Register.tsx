import { Form, InputEmail, InputPassword, PageContent, useTranslation } from "@custhome/ui";
import AuthNav from "../components/AuthNav";
import { useRegister } from "../hooks/useRegister";

export default function Register() {
  const { t } = useTranslation();
  const { email, setEmail, password, setPassword, confirm, setConfirm, error, loading, submit } =
    useRegister();
  return (
    <PageContent
      title={t("auth.register.title")}
      footer={<AuthNav links={[{ to: "/login", label: t("auth.link.haveAccount") }]} />}
    >
      <Form
        onSubmit={submit}
        submitLabel={t("auth.register.submit")}
        loading={loading}
        error={error}
      >
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
      </Form>
    </PageContent>
  );
}
