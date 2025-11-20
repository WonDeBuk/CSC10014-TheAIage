import { createBrowserRouter } from "react-router-dom";

import LandingPage from "../presentation/pages/LandingPage/LandingPage";
import LoginPage from "../presentation/pages/LoginPage/LoginPage";
import DashboardPage from "../presentation/pages/DashboardPage/DashboardPage";
import CounsellorsPage from "../presentation/pages/CounsellorsPage/CounsellorsPage";
import AboutPage from "../presentation/pages/AboutPage/AboutPage";
import RegisterPage from "../presentation/pages/RegisterPage/RegisterPage";
import ChatPage from "../presentation/pages/ChatPage/ChatPage";

import RouteProtector from "@/presentation/components/RouteProtector";
export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  {
    path: "/dashboard",
    element: (
      <RouteProtector>
        <DashboardPage />
      </RouteProtector>
    ),
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/counsellors", element: <CounsellorsPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/chat", element: <ChatPage /> },
  { path: "*", element: <div>404 Not Found</div> },
]);
