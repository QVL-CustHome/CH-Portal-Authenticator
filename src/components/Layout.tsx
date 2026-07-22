import { Icon, Layout as AuthLayout } from "canopui";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <AuthLayout logo={<Icon name="home" variant="solid" color="accent" size="lg" />} animatedShapes>
      <Outlet />
    </AuthLayout>
  );
}
