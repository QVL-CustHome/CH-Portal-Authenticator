import { Link } from "@custhome/ui";
import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

interface AppLinkProps {
  to: string;
  children: ReactNode;
  newTab?: boolean;
}

export default function AppLink({ to, children, newTab }: AppLinkProps) {
  const newTabProps = newTab
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Link component={RouterLink} to={to} size="small" color="primary" {...newTabProps}>
      {children}
    </Link>
  );
}
