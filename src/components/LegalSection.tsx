import { Heading, Stack, type CanopHeadingLevel } from "canopui";
import type { ReactNode } from "react";

interface LegalSectionProps {
  title: string;
  level?: CanopHeadingLevel;
  children: ReactNode;
}

export default function LegalSection({ title, level = 3, children }: LegalSectionProps) {
  return (
    <Stack as="section" gap="sm">
      <Heading level={level} size={5}>
        {title}
      </Heading>
      {children}
    </Stack>
  );
}
