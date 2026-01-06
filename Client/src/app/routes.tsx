import { createBrowserRouter } from "react-router-dom";

import LandingPage from "../presentation/pages/LandingPage/LandingPage";
import LoginPage from "../presentation/pages/LoginPage/LoginPage";
import DashboardPage from "../presentation/pages/DashboardPage/DashboardPage";
import CounsellorsPage from "../presentation/pages/CounsellorsPage/CounsellorsPage";
import AboutPage from "../presentation/pages/AboutPage/AboutPage";
import RegisterPage from "../presentation/pages/RegisterPage/RegisterPage";
import ChatPage from "../presentation/pages/ChatPage/ChatPage";
import ChatPageAI from "@/presentation/pages/ChatPage/ChatPageAI";
import PersonalPage from "../presentation/pages/PersonalPage/PersonalPage";
import TestSelectionPage from "../presentation/pages/TestPage/TestSelectionPage";
import GAD7page from "../presentation/pages/TestPage/GAD7page";
import DASS21page from "../presentation/pages/TestPage/DASS21page";
import MBIpage from "../presentation/pages/TestPage/MBIpage";
import PHQ9page from "../presentation/pages/TestPage/PHQ9page";

import ChatBot from "@/presentation/pages/ChatBotTest/ChatBot";
import FileUpload from "@/presentation/pages/ChatBotTest/FileUpload";

import RouteProtector from "@/presentation/components/RouteProtector";
import ActivityPage from "@/presentation/pages/ActivityPage/ActivityPage";
import StudyPage from "@/presentation/pages/StudyPage/StudyPage";

export const router = createBrowserRouter([

  { path: "/", element: <LandingPage /> },
  {
    path: "/dashboard", element: (
      <RouteProtector>
        <DashboardPage />
      </RouteProtector>)
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/counsellors", element: <CounsellorsPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/chat", element: <ChatPage /> },
  { path: "/chatai", element: <ChatPageAI /> },
  { path: "/study", element: <StudyPage /> },
  { path: "activity", element: <ActivityPage /> },

  { path: "/personal", element: <PersonalPage /> },

  { path: "/test", element: <TestSelectionPage /> },
  { path: "/test/gad7", element: <GAD7page /> },
  { path: "/test/dass21", element: <DASS21page /> },
  { path: "/test/mbi", element: <MBIpage /> },
  { path: "/test/phq9", element: <PHQ9page /> },

  { path: "/chatbot-test", element: <ChatBot /> },
  { path: "/file", element: <FileUpload /> },
  { path: "*", element: <div>404 Not Found</div> },
]);
