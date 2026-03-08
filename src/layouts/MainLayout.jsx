import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ToastViewport from "../components/ui/ToastViewport";

export default function MainLayout() {
  const location = useLocation();
  const isSupportRoute = location.pathname.startsWith("/support");
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={isSupportRoute ? "p-0" : "shell py-8"}>
        <Outlet />
      </main>
      <Footer compact={isSupportRoute || isAuthRoute} />
      <ToastViewport />
    </div>
  );
}
