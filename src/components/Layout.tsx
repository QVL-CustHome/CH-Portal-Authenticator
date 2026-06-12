import { Layout as AuthLayout } from "@custhome/ui";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
