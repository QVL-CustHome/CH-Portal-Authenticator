import { Feedback, Form, InputPassword, PageContent, useTranslation } from "@custhome/ui";
import AuthNav from "../components/AuthNav";
import { useResetPassword } from "../hooks/useResetPassword";

export default function ResetPassword() {
  const { t } = useTranslation();
  const { token, password, setPassword, confirm, setConfirm, error, loading, submit } =
    useResetPassword();

  if (!token) {
    return (
      <PageContent
        title={t("auth.reset.title")}
        footer={<AuthNav links={[{ to: "/forgot-password", label: t("auth.link.newRequest") }]} />}
      >
        <Feedback error={t("auth.reset.tokenMissing")} />
      </PageContent>
    );
  }

  return (
    <PageContent
      title={t("auth.reset.title")}
      footer={<AuthNav links={[{ to: "/login", label: t("auth.link.login") }]} />}
    >
      <Form onSubmit={submit} submitLabel={t("auth.reset.submit")} loading={loading} error={error}>
        <InputPassword
          label={t("auth.field.newPassword")}
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          helperText={t("auth.field.passwordHint")}
          required
        />
        <InputPassword
          label={t("auth.field.confirm")}
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
          required
        />
      </Form>
    </PageContent>
  );
}
