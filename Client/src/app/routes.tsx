import { createBrowserRouter } from "react-router-dom";

import LandingPage from "../presentation/pages/LandingPage/LandingPage";
import LoginPage from "../presentation/pages/LoginPage/LoginPage";
import DashboardPage from "../presentation/pages/DashboardPage/DashboardPage";
import CounsellorsPage from "../presentation/pages/CounsellorsPage/CounsellorsPage";
import AboutPage from "../presentation/pages/AboutPage/AboutPage";
import RegisterPage from "../presentation/pages/RegisterPage/RegisterPage";
import ChatPage from "../presentation/pages/ChatPage/ChatPage";

import RouteProtector from "@/presentation/components/RouteProtector";

import TestSelection from "@/presentation/pages/TestPage/TestSelectionPage";
import TestDASS21 from "@/presentation/pages/TestPage/DASS21page";
import TestGAD7 from "@/presentation/pages/TestPage/GAD7page";
import TestPHQ9 from "@/presentation/pages/TestPage/PHQ9page";
import TestMBI from "@/presentation/pages/TestPage/MBIpage";


export const router = createBrowserRouter([

  { path: "/", element: <LandingPage /> },
  { path: "/dashboard", element: (
    <RouteProtector>
      <DashboardPage />
    </RouteProtector>) },
  { path: "/login", element: <LoginPage /> },
  { path: "/testselection", element: <TestSelection /> },
      { path: "/testselection/DASS21test", element: <TestDASS21 /> },
      { path: "/testselection/GAD7test", element: <TestGAD7 /> },
      { path: "/testselection/PHQ9test", element: <TestPHQ9 /> },
      { path: "/testselection/MBItest", element: <TestMBI /> },

  { path: "/register", element: <RegisterPage /> },
  { path: "/counsellors", element: <CounsellorsPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/chat", element: <ChatPage /> },
  { path: "*", element: <div>404 Not Found</div> },
]);
