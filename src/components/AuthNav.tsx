import { Stack } from "@custhome/ui";
import AppLink from "./AppLink";

interface AuthNavItem {
  to: string;
  label: string;
}

interface AuthNavProps {
  links: AuthNavItem[];
}

export default function AuthNav({ links }: AuthNavProps) {
  return (
    <Stack as="nav" gap="xs" label="Navigation d'authentification">
      {links.map((link) => (
        <AppLink key={link.to} to={link.to}>
          {link.label}
        </AppLink>
      ))}
    </Stack>
  );
}
