import { Layout as AuthLayout } from "canopui";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
