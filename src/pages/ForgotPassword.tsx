import { Feedback, Form, InputEmail, PageContent, useTranslation } from "@custhome/ui";
import AuthNav from "../components/AuthNav";
import { useForgotPassword } from "../hooks/useForgotPassword";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const { email, setEmail, sent, loading, submit } = useForgotPassword();
  return (
    <PageContent
      title={t("auth.forgot.title")}
      footer={<AuthNav links={[{ to: "/login", label: t("auth.link.login") }]} />}
    >
      {sent ? (
        <Feedback info={t("auth.forgot.sent")} />
      ) : (
        <Form onSubmit={submit} submitLabel={t("auth.forgot.submit")} loading={loading}>
          <InputEmail label={t("auth.field.email")} value={email} onChange={setEmail} required />
        </Form>
      )}
    </PageContent>
  );
}
