import { BulletList, Feedback, Stack, useTranslation } from "canopui";
import LegalSection from "./LegalSection";
import { TERMS_VERSION, TERMS_VERSION_DATE } from "../lib/termsVersion";

type CguSection =
  | { key: string; kind: "text" }
  | { key: string; kind: "list"; items: readonly string[] };

const CGU_SECTIONS: readonly CguSection[] = [
  { key: "object", kind: "text" },
  { key: "acceptance", kind: "text" },
  { key: "services", kind: "list", items: ["authenticator", "drive", "budgy", "admin"] },
  { key: "account", kind: "text" },
  { key: "obligations", kind: "list", items: ["item1", "item2", "item3", "item4"] },
  { key: "driveStorage", kind: "text" },
  { key: "banking", kind: "text" },
  { key: "personalData", kind: "text" },
  { key: "intellectualProperty", kind: "text" },
  { key: "liability", kind: "text" },
  { key: "availability", kind: "text" },
  { key: "termination", kind: "text" },
  { key: "modifications", kind: "text" },
  { key: "governingLaw", kind: "text" },
];

export default function CguTerms() {
  const { t, locale } = useTranslation();
  const formattedDate = new Date(TERMS_VERSION_DATE).toLocaleDateString(
    locale === "en" ? "en-GB" : "fr-FR"
  );

  return (
    <Stack gap="lg">
      <Feedback severity="info">
        {t("auth.cgu.versionLabel", { version: TERMS_VERSION, date: formattedDate })}
      </Feedback>
      {CGU_SECTIONS.map((section) => (
        <LegalSection key={section.key} title={t(`auth.cgu.${section.key}.title`)}>
          {section.kind === "text" ? (
            t(`auth.cgu.${section.key}.body`)
          ) : (
            <>
              {t(`auth.cgu.${section.key}.intro`)}
              <BulletList
                items={section.items.map((item) => ({
                  key: item,
                  content: t(`auth.cgu.${section.key}.${item}`),
                }))}
              />
            </>
          )}
        </LegalSection>
      ))}
    </Stack>
  );
}
