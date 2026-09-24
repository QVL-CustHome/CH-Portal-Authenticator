import { Stack } from "canopui";
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
    <Stack as="nav" gap="xs" ariaLabel="Navigation d'authentification">
      {links.map((link) => (
        <AppLink key={link.to} to={link.to}>
          {link.label}
        </AppLink>
      ))}
    </Stack>
  );
}
