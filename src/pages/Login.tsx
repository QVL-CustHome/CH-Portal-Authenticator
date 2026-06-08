import { Form, InputEmail, InputPassword, PageContent, useTranslation } from "@custhome/ui";
import AuthNav from "../components/AuthNav";
import { useLogin } from "../hooks/useLogin";

export default function Login() {
  const { t } = useTranslation();
  const { email, setEmail, password, setPassword, error, loading, submit } = useLogin();
  return (
    <PageContent
      title={t("auth.login.title")}
      footer={
        <AuthNav
          links={[
            { to: "/forgot-password", label: t("auth.link.forgot") },
            { to: "/register", label: t("auth.link.register") },
          ]}
        />
      }
    >
      <Form onSubmit={submit} submitLabel={t("auth.login.submit")} loading={loading} error={error}>
        <InputEmail label={t("auth.field.email")} value={email} onChange={setEmail} required />
        <InputPassword
          label={t("auth.field.password")}
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          required
        />
      </Form>
    </PageContent>
  );
}
