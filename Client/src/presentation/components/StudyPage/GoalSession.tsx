import React, {useState, useRef, useEffect } from "react";
import { useAuth } from "@/app/providers/AuthProvider";

interface task {
    title: string, 
    desc: string,
    difficulty: number,
    is_completed: boolean
}

const  GoalSession = () => {
    const { user, getLocalDate } = useAuth()
    const [todayGoal, setTodayGoal] = useState<task[]>([])
    const [nextGoal, setNextGoal] = useState<task[]>([])

    return (
        <main className="flex-1 min-h-full hero-bg">
            <div className="w-full h-full flex justify-center items-center">
                <div className="text-[30px] font-bold">TODAY'S TASK</div>
                <div className="">
                    <div></div>
                    <div></div>
                </div>
            </div>
        </main>
    )
}

export default GoalSession