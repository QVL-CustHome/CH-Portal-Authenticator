import { PageContent, useTranslation } from "@custhome/ui";
import CguTerms from "../components/CguTerms";
import LegalNotice from "../components/LegalNotice";
import { useScrollToHash } from "../hooks/useScrollToHash";

export default function Cgu() {
  const { t } = useTranslation();
  useScrollToHash();

  return (
    <PageContent title={t("auth.cgu.title")}>
      <CguTerms />
      <LegalNotice />
    </PageContent>
  );
}
