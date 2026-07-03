import { useTranslation } from "@custhome/ui";
import AuthPageContent from "../components/AuthPageContent";
import CguTerms from "../components/CguTerms";
import LegalNotice from "../components/LegalNotice";
import { useScrollToHash } from "../hooks/useScrollToHash";

export default function Cgu() {
  const { t } = useTranslation();
  useScrollToHash();

  return (
    <AuthPageContent title={t("auth.cgu.title")}>
      <CguTerms />
      <LegalNotice />
    </AuthPageContent>
  );
}
