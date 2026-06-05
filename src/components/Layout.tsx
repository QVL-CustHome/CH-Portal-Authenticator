import { Card, Layout as ChLayout } from "@custhome/ui";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <ChLayout>
      <Card>
        <Outlet />
      </Card>
    </ChLayout>
  );
}
