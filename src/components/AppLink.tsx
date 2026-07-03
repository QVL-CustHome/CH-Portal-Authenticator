import { Link } from "@custhome/ui";
import type { ReactNode } from "react";
import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps,
} from "react-router-dom";

interface AppLinkProps {
  to: string;
  children: ReactNode;
  newTab?: boolean;
}

function NewTabRouterLink(props: RouterLinkProps) {
  return <RouterLink {...props} target="_blank" rel="noopener noreferrer" />;
}

export default function AppLink({ to, children, newTab }: AppLinkProps) {
  return (
    <Link
      component={newTab ? NewTabRouterLink : RouterLink}
      to={to}
      size="small"
      color="primary"
    >
      {children}
    </Link>
  );
}
