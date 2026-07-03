import { PageContent, type ChPageContentProps } from "@custhome/ui";
import LegalLinks from "./LegalLinks";

export default function AuthPageContent({
  footer,
  settingsFooter,
  children,
  ...rest
}: ChPageContentProps) {
  return (
    <PageContent
      {...rest}
      footer={
        <>
          {footer}
          <div className="legal-footer">
            <LegalLinks direction="row" />
          </div>
        </>
      }
      settingsFooter={settingsFooter ?? <LegalLinks />}
    >
      {children}
    </PageContent>
  );
}
