import { Feedback, PageContent, useTranslation } from "@custhome/ui";
import AuthNav from "../components/AuthNav";

export default function PendingValidation() {
  const { t } = useTranslation();
  return (
    <PageContent
      title={t("auth.pending.title")}
      footer={<AuthNav links={[{ to: "/login", label: t("auth.link.login") }]} />}
    >
      <Feedback info={t("auth.pending.message")} />
    </PageContent>
  );
}
