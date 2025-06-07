
import { HomeIcon } from "lucide-react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import  ProtectedRoute  from "./components/ProtectedRoute";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Auth",
    to: "/auth",
    page: <Auth />,
  },
  {
    title: "Admin",
    to: "/admin",
    page: <ProtectedRoute><Admin /></ProtectedRoute>,
  }
];
