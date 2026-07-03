import { Feedback, useTranslation } from "@custhome/ui";
import AuthNav from "../components/AuthNav";
import AuthPageContent from "../components/AuthPageContent";

export default function PendingValidation() {
  const { t } = useTranslation();
  return (
    <AuthPageContent
      title={t("auth.pending.title")}
      footer={<AuthNav links={[{ to: "/login", label: t("auth.link.login") }]} />}
    >
      <Feedback severity="info">{t("auth.pending.message")}</Feedback>
    </AuthPageContent>
  );
}
