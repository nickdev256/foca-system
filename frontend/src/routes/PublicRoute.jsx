import { Outlet } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";

export default function PublicRoute() {
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
}