import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <main className="layout">
      <h1 className="brand">CustHome</h1>
      <div className="card">
        <Outlet />
      </div>
    </main>
  );
}
