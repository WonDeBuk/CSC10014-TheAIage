import { createBrowserRouter } from "react-router-dom";

import LandingPage from "../presentation/pages/LandingPage/LandingPage";
import LoginPage from "../presentation/pages/LoginPage/LoginPage";
import DashboardPage from "../presentation/pages/DashboardPage/DashboardPage";
import CounsellorsPage from "../presentation/pages/CounsellorsPage/CounsellorsPage";
import AboutPage from "../presentation/pages/AboutPage/AboutPage";
import RegisterPage from "../presentation/pages/RegisterPage/RegisterPage";
import ChatPage from "../presentation/pages/ChatPage/ChatPage";
import ChatPageAI from "@/presentation/pages/ChatPage/ChatPageAI";

import ChatBot from "@/presentation/pages/ChatBotTest/ChatBot";
import FileUpload from "@/presentation/pages/ChatBotTest/FileUpload";

import RouteProtector from "@/presentation/components/RouteProtector";
import ActivityPage from "@/presentation/pages/ActivityPage/ActivityPage";

import CounsellorMessagegPage from "@/presentation/pages/MessagePage/CounsellorMessagePage";

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
  { path: "/chatai", element: <ChatPageAI /> },
  { path: "activity", element: <ActivityPage/>},

  { path: "/test", element: <ChatBot />},
  { path: "/file", element: <FileUpload />},
  { path: "/message", element: <CounsellorMessagegPage /> },
  { path: "*", element: <div>404 Not Found</div> },
]);
