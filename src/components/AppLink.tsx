import { Link } from "@custhome/ui";
import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

interface AppLinkProps {
  to: string;
  children: ReactNode;
}

export default function AppLink({ to, children }: AppLinkProps) {
  return (
    <Link component={RouterLink} to={to} size="small">
      {children}
    </Link>
  );
}
