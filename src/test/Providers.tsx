import { ChI18nProvider, ChThemeProvider } from "@custhome/ui";
import type { ReactNode } from "react";
import { messages } from "../i18n/messages";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ChI18nProvider locale="fr" messages={messages}>
      <ChThemeProvider>{children}</ChThemeProvider>
    </ChI18nProvider>
  );
}
