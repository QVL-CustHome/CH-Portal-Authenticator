import { Stack, useTranslation, type ChStackDirection } from "@custhome/ui";
import AppLink from "./AppLink";

interface LegalLinksProps {
  direction?: ChStackDirection;
}

export default function LegalLinks({ direction = "column" }: LegalLinksProps) {
  const { t } = useTranslation();

  return (
    <Stack
      as="nav"
      direction={direction}
      gap={direction === "row" ? "md" : "xs"}
      alignItems="center"
      label={t("auth.legal.footerLabel")}
    >
      <AppLink to="/cgu">{t("auth.cgu.title")}</AppLink>
      <AppLink to="/cgu#mentions-legales">{t("auth.legal.title")}</AppLink>
    </Stack>
  );
}
