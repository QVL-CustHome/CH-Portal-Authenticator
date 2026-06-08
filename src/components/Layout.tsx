import { PageScaffold } from "@custhome/ui";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <PageScaffold>
      <Outlet />
    </PageScaffold>
  );
}
