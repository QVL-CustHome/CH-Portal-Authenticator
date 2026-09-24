import { CanopI18nProvider, CanopThemeProvider } from "canopui";
import type { ReactNode } from "react";
import { messages } from "../i18n/messages";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CanopI18nProvider locale="fr" messages={messages}>
      <CanopThemeProvider>{children}</CanopThemeProvider>
    </CanopI18nProvider>
  );
}
