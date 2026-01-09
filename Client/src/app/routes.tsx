import { createBrowserRouter } from "react-router-dom";

import LandingPage from "../presentation/pages/LandingPage/LandingPage";
import LoginPage from "../presentation/pages/LoginPage/LoginPage";
import CounsellorsPage from "../presentation/pages/CounsellorsPage/CounsellorsPage";
import AboutPage from "../presentation/pages/AboutPage/AboutPage";
import RegisterPage from "../presentation/pages/RegisterPage/RegisterPage";
import ChatPage from "../presentation/pages/ChatPage/ChatPage";
import ChatPageAI from "@/presentation/pages/ChatPage/ChatPageAI";
import ActivityPage from "@/presentation/pages/ActivityPage/ActivityPage";
import StudyPage from "@/presentation/pages/StudyPage/StudyPage";

import ChatBot from "@/presentation/pages/ChatBotTest/ChatBot";
import FileUpload from "@/presentation/pages/ChatBotTest/FileUpload";

import RouteProtector from "@/presentation/components/RouteProtector";
import NonUserProtector from "@/presentation/components/NonUserProtector";
import PersonalPage from "@/presentation/pages/PersonalPage/PersonalPage";

import TestPage from "@/presentation/pages/TestPage/TestSelectionPage";
import GAD7TestPage from "@/presentation/pages/TestPage/GAD7page";
import DASS21TestPage from "@/presentation/pages/TestPage/DASS21page";
import MBITestPage from "@/presentation/pages/TestPage/MBIpage";
import PHQ9TestPage from "@/presentation/pages/TestPage/PHQ9Page";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/about", element: <AboutPage /> },
  
  {
    element: <NonUserProtector />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ]
  },

  {
    element: <RouteProtector />, // ← layout wrapper
    children: [
      { path: "/personal", element: <PersonalPage /> },
      { path: "/test", element: <TestPage />},
      { path: "/test/gad7", element: <GAD7TestPage /> },
      { path: "/test/dass21", element: <DASS21TestPage /> },
      { path: "/test/mbi", element: <MBITestPage /> },
      { path: "/test/phq9", element: <PHQ9TestPage /> },
      { path: "/counsellors", element: <CounsellorsPage /> },
      { path: "/chat", element: <ChatPage /> },
      { path: "/chatai", element: <ChatPageAI /> },
      { path: "/study", element: <StudyPage /> },
      { path: "/activity", element: <ActivityPage /> },
      { path: "/test", element: <ChatBot /> },
      { path: "/file", element: <FileUpload /> },
    ],
  },

  { path: "*", element: <div>404 Not Found</div> },
]);