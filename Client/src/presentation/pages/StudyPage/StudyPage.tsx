import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Award, Clock, Activity, Sprout, NotebookPen } from 'lucide-react';
import NaviBar from "@/presentation/components/LandingPage/NaviBar";
import PomodoroSession from '@/presentation/components/StudyPage/PomodoroSession';
import GoalSession from '@/presentation/components/StudyPage/GoalSession';
import GardenSession from '@/presentation/components/StudyPage/GardenSession';

type session = "pomodoro" | "garden" | "diary" | "mood" | "goal"

const act: Record<session, React.JSX.Element> = {
    pomodoro: <PomodoroSession></PomodoroSession>,
    garden: <GardenSession></GardenSession>,
    diary: <></>,
    mood: <></>,
    goal: <GoalSession />
}

const StudyPage: React.FC = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const actParam = searchParams.get("session")
    const [curAct, setAct] = useState<session>("pomodoro")

    useEffect(() => {
        if (actParam) {
            switch (actParam) {
                case "pomodoro":
                case "garden":
                case "diary":
                case "mood":
                case "goal":
                    setAct(actParam)
                    break
                default:
                    setAct("pomodoro")
            }
        }
        else setAct("pomodoro")
    }, [actParam])

    return (
        <div className="min-h-full w-full flex hero-bg font-sans 
                        text-slate-800 overflow-hidden relative">
            {/* Sidebar */}
            <div className="absolute top-0 left-0 right-0 z-50 flex justify-center pt-4">
                <NaviBar isStatic={true} />
            </div>
            <aside className="w-86 border-r border-slate-200 
                              flex flex-col bg-slate-50 hidden md:flex shadow-xl z-10">
                <div className="p-6 border-b border-slate-350">
                    <h1 className="text-2xl font-bold text-black text-center">
                        Activity Dashboard
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 flex flex-col gap-3 justify-start items-center">
                    <button className={`w-full flex items-center 
                                        gap-4 px-6 py-6 rounded-full text-slate-900 
                                        font-bold transition-all 
                                        shadow-md ${actParam === "pomodoro" ? "bg-white outline-2" : "bg-gray-100 hover:bg-gray-200"}`}
                        onClick={() => {
                            navigate(`/study/?session=pomodoro`)
                        }}>
                        <Clock className="w-5 h-5" />
                        <span className="text-xl">Study</span>
                    </button>
                    <button className={`w-full flex items-center 
                                        gap-4 px-6 py-6 rounded-full text-slate-900 
                                        font-bold transition-all 
                                        shadow-md ${actParam === "goal" ? "bg-white outline-2" : "bg-gray-100 hover:bg-gray-200"}`}
                        onClick={() => {
                            navigate(`/study/?session=goal`)
                        }}>
                        <Award className="w-5 h-5" />
                        <span className="text-xl">Goal</span>
                    </button>
                    <button className={`w-full flex items-center 
                                        gap-4 px-6 py-6 rounded-full text-slate-900 
                                        font-bold transition-all 
                                        shadow-md ${actParam === "mood" ? "bg-white outline-2" : "bg-gray-100 hover:bg-gray-200"}`}
                        onClick={() => {
                            navigate(`/study/?session=mood`)
                        }}>
                        <Activity className="w-5 h-5" />
                        <span className="text-xl">Mood</span>
                    </button>
                    <button className={`w-full flex items-center 
                                        gap-4 px-6 py-6 rounded-full text-slate-900 
                                        font-bold transition-all 
                                        shadow-md ${actParam === "garden" ? "bg-white outline-2" : "bg-gray-100 hover:bg-gray-200"}`}
                        onClick={() => {
                            navigate(`/study/?session=garden`)
                        }}>
                        <Sprout className="w-5 h-5" />
                        <span className="text-xl">Garden</span>
                    </button>
                    <button className={`w-full flex items-center 
                                        gap-4 px-6 py-6 rounded-full text-slate-900 
                                        font-bold transition-all 
                                        shadow-md ${actParam === "diary" ? "bg-white outline-2" : "bg-gray-100 hover:bg-gray-200"}`}
                        onClick={() => {
                            navigate(`/study/?session=diary`)
                        }}>
                        <NotebookPen className="w-5 h-5" />
                        <span className="text-xl">Diary</span>
                    </button>
                </nav>
            </aside>

            {act[curAct]}
        </div>
    );
};

export default StudyPage;