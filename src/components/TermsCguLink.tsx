import { Link } from "@custhome/ui";
import type { ReactNode } from "react";
import { Link as RouterLink, type LinkProps } from "react-router-dom";

function NewTabRouterLink(props: Omit<LinkProps, "target" | "rel">) {
  return <RouterLink {...props} target="_blank" rel="noopener noreferrer" />;
}

interface TermsCguLinkProps {
  children: ReactNode;
}

export default function TermsCguLink({ children }: TermsCguLinkProps) {
  return (
    <Link component={NewTabRouterLink} to="/cgu" size="small" color="primary">
      {children}
    </Link>
  );
}
