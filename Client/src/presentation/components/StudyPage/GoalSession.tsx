import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { Star, CheckCheck, Moon, Sun, Eraser, X, Weight } from "lucide-react";
import AxiosInstance from "@/util/AxiosInstance";
import { Axios } from "axios";

interface task {
    task_id: string,
    title: string,
    desc: string,
    difficulty: number,
    is_completed: boolean
}

interface difbarProp {
    difficulty: number
}

const colors = [
    "bg-[#67b926]",
    "bg-[#91ba1f]",
    "bg-[#91ba1f]",
    "bg-[#ffb702]",
    "bg-[#e55401]",
    "bg-[#cc271d]",
];

const DifficultyBar: React.FC<difbarProp> = ({ difficulty }) => {
    return (
        <div className="flex w-full h-5 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className={`flex-1 h-full ${i < difficulty ? colors[i] : "bg-gray-200"
                        }`}
                ></div>
            ))}
        </div>
    );
};

const GoalSession = () => {
    const { user, getLocalDate } = useAuth()
    const [todayGoal, setTodayGoal] = useState<task[]>([])
    const [nextGoal, setNextGoal] = useState<task[]>([])
    const [miniBar, setMiniBar] = useState<"" | "edit" | "preview">("")
    const [inView, setView] = useState<task | null>(null)

    const [futureTask, setFutureTask] = useState<task>({task_id: "", title: "", desc: "", difficulty: 1, is_completed: false })
    const [weight, setWeight] = useState<number>(0)

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFutureTask((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const [isTransmit, setTransmit] = useState<boolean>(false)
    const [hasToday, setHasToday] = useState<boolean>(false)
    const [hasFuture, setHasFuture] = useState<boolean>(false)

    useEffect(() => {
        const fetchTodayGoal = async () => {
            try {
                const res = await AxiosInstance.get(`/activity/daily/${getLocalDate(0)}`)
                setTodayGoal(res.data)
            }
            catch (e: any) {
                setTodayGoal([])
            }
            setHasToday(true)
        }

        const fetchTomorrowGoal = async () => {
            try {
                const res = await AxiosInstance.get(`/activity/daily/${getLocalDate(1)}`)
                setNextGoal(res.data)
            }
            catch (e: any) {
                setNextGoal([])
            }
            setHasFuture(true)
        }

        fetchTodayGoal()
        fetchTomorrowGoal()
    }, [])

    useEffect(() => {
        let cal = 0
        nextGoal.forEach(g => { cal += g.difficulty })
        setWeight(cal)
    }, [nextGoal])

    return (
        <main className="flex-1 hero-bg p-5 overflow-auto select-none">
            {hasToday && hasFuture ?
            <div className="w-full h-full flex items-center">
                <div className="flex-1 h-full flex flex-col justify-center items-center gap-3 pt-5">
                    <div className="h-[30px] w-full text-left"></div>
                    <div className="w-full h-[725px] gap-5 flex justify-between">
                        <div className="w-1/2 h-full flex flex-col items-center p-2 gap-2">
                            <div className="w-full flex-1 flex flex-col items-center">
                                <p className="w-full h-10 text-[25px] font-medium text-left">Tiếp tục:</p>
                                <div className="w-full h-0.5 bg-red-500/30"></div>
                            </div>
                            {todayGoal.some(goal => !goal.is_completed) ?
                                <div className="w-full h-[660px] flex flex-col gap-3 items-center overflow-y-scroll overflow-x-hidden">
                                    {todayGoal.filter(g => g.is_completed === false).map((goal, _) =>
                                        <div className="w-full h-[120px] text-black text-[12px] rounded-md bg-white/70 hover:bg-white/90 flex group border border-red-500 hover:scale-95 transition-all duration-150">
                                            <div className="flex-1 h-full flex flex-col justify-center items-start p-5 gap-2"
                                                onClick={() => {
                                                    const index = todayGoal.findIndex(f => f === goal)
                                                    if (index === -1) return
                                                    setView(todayGoal[index])
                                                }}>
                                                <div className="text-[25px] font-bold w-full h-10 line-clamp-1">{goal.title}</div>
                                                <DifficultyBar difficulty={goal.difficulty}></DifficultyBar>
                                            </div>
                                            <div className="w-[120px] h-[120px] flex justify-center items-center">
                                                <Star size={40} strokeWidth={1.5} className={`text-gray-200 hover:scale-150 hover:text-yellow-500 transition-all duration-75 ${isTransmit ? "pointer-events-none" : ""}`}
                                                onClick={async () => {
                                                    setTransmit(true)
                                                    try {
                                                        await AxiosInstance.post("/activity/task/modify", {
                                                            "action_type": "complete",
                                                            "task_id": goal.task_id
                                                        })

                                                        await AxiosInstance.post("/activity/match", {
                                                            "activity_type": "goal",
                                                            "difficulty": goal.difficulty,
                                                            "date": getLocalDate(0)
                                                        })
                                                    }
                                                    catch (e: any) {
                                                        console.log(e.response)
                                                    }

                                                    setTodayGoal((prev) => {
                                                        const change = [...prev]
                                                        const idx = change.findIndex(g => g.task_id === goal.task_id)
                                                        change[idx] = {
                                                            ...change[idx],
                                                            is_completed: true
                                                        }
                                                        return change
                                                    })
                                                    setTransmit(false)
                                                }} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                :
                                <div className="w-full h-full p-7 flex justify-center items-center opacity-20 bg-white">
                                    <div className="text-[35px] font-light whitespace-pre-wrap text-black"><Sun size={150} strokeWidth={0.75} /></div>
                                </div>
                            }
                        </div>

                        <div className="w-1/2 h-full flex flex-col items-center p-2 gap-2">
                            <div className="w-full flex-1 flex flex-col items-center">
                                <p className="w-full h-10 text-[25px] font-medium text-left">Hoàn thành:</p>
                                <div className="w-full h-0.5 bg-lime-500/30"></div>
                            </div>
                            {todayGoal.some(goal => goal.is_completed) ?
                                <div className="w-full h-[660px] flex flex-col gap-3 items-center overflow-y-scroll overflow-x-hidden">
                                    {todayGoal.filter(g => g.is_completed).map((goal, _) =>
                                        <div className="w-full h-[120px] text-black text-[12px] rounded-md bg-white/70 hover:opacity-90 opacity-50 hover:scale-95 flex group relative border border-lime-500 transition-all duration-150"
                                            onClick={() => {
                                                const index = todayGoal.findIndex(f => f.task_id === goal.task_id)
                                                if (index === -1) return
                                                setView(todayGoal[index])
                                            }}>
                                            <div className="w-full h-full top-0 left-0 absolute rounded-md bg-gray-800/70"></div>
                                            <div className="flex-1 h-full flex flex-col justify-center items-start p-5 gap-2">
                                                <div className="text-[25px] font-bold w-full h-10 line-clamp-1">{goal.title}</div>
                                                <DifficultyBar difficulty={goal.difficulty}></DifficultyBar>
                                            </div>
                                            <div className="w-[120px] h-[120px] flex justify-center items-center text-[#00ff00] scale-150"><CheckCheck size={40} strokeWidth={1.2} /></div>
                                        </div>
                                    )}
                                </div> :
                                <div className="w-full h-full p-7 flex justify-center items-center opacity-20 bg-white">
                                    <div className="text-[35px] font-light whitespace-pre-wrap text-black"><Moon size={150} strokeWidth={0.75} /></div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="w-[600px] h-full flex flex-col justify-center items-center p-5 gap-2">
                    <div className="w-full h-[60px] flex justify-end items-center gap-2">
                        <div className={`w-[120px] h-full rounded-full shadow-md flex justify-center items-center font-medium text-[20px] ${miniBar === "preview" ? "bg-white/60 scale-90 text-gray-500 border-2 border-gray-600" : "bg-white/80 hover:scale-90 hover:border-2 border-black transition-all duration-100"}`}
                            onClick={() => {
                                setView(null)
                                if (miniBar === "preview") setMiniBar("")
                                else setMiniBar("preview")
                            }}>
                            Xem trước
                        </div>
                        <div className={`w-[120px] h-full rounded-full shadow-md flex justify-center items-center font-medium text-[20px] ${miniBar === "edit" ? "bg-white/60 scale-90 text-gray-500 border-2 border-gray-600" : "bg-white/80 hover:scale-90 hover:border-2 border-black transition-all duration-100"}`}
                            onClick={() => {
                                setView(null)
                                if (miniBar === "edit") setMiniBar("")
                                else setMiniBar("edit")
                            }}>
                            Tạo mới
                        </div>
                    </div>
                    <div className={`w-full h-[650px] rounded-md relative bg-white/0 ${miniBar === "" || inView ? "" : "border-2 border-white"}`}>
                        {inView ? <div className="w-full h-full top-0 left-0 bg-white border-2 border-white rounded-md absolute flex flex-col gap-5 p-5">
                            <div className="w-full flex flex-col items-center gap-2">
                                <div className="w-full flex justify-between items-start">
                                    <p className="font-medium text-[30px] text-left max-w-4/5">{inView.title}</p>
                                    <X size={40} className="hover:scale-120 hover:text-red-500"
                                        onClick={() => { setView(null) }} />
                                </div>
                                <DifficultyBar difficulty={inView.difficulty}></DifficultyBar>
                            </div>

                            <div className="w-full flex-1 flex flex-col bg-gray-400/20 rounded-md overflow-y-scroll overflow-x-hidden">
                                <div className="w-full text-[22px] text-black rounded-md p-3 flex justify-start items-start whitespace-pre-wrap">{inView.desc}</div>
                            </div>
                        </div> :
                            <>
                                {miniBar !== "" ?
                                    <>
                                        {miniBar === "edit" ?
                                            <div className={`w-full h-full flex flex-col justify-start items-start gap-5 p-10 ${inView ? "pointer-events-none" : ""}`}>
                                                <div className="w-full h-[50px] text-center font-bold text-black text-[30px] relative">
                                                    <p>Tạo kế hoạch</p>
                                                    <div className="w-full h-0.5 bg-gray-500/20"></div>
                                                    <X className="w-10 h-10 absolute right-0 top-0 hover:scale-120 hover:text-red-500"
                                                        onClick={() => setMiniBar("")}></X>
                                                </div>

                                                <div className="w-full flex-1 flex flex-col gap-7">
                                                    <div className="w-full">
                                                        <p className="text-[24px] font-medium">Tiêu đề:</p>
                                                        <input className="bg-gray-100 w-full h-[50px] rounded-md p-2 text-[20px] focus:outline-blue-500 focus:outline-1"
                                                            name="title"
                                                            maxLength={30}
                                                            onChange={handleChange}
                                                            placeholder="Hoàn thành đồ án Computational Thinking."
                                                            value={futureTask.title}></input>
                                                    </div>

                                                    <div className="w-full">
                                                        <p className="text-[24px] font-medium">Mô tả:</p>
                                                        <textarea className="bg-gray-100 w-full h-50 rounded-md p-2 text-[20px] focus:outline-blue-500 focus:outline-1"
                                                            name="desc"
                                                            onChange={handleChange}
                                                            placeholder="Hoàn thành trang Chat, Activity và trang Counsellor."
                                                            value={futureTask.desc}></textarea>
                                                    </div>

                                                    <div className="w-full">
                                                        <p className="text-[24px] font-medium">Độ khó:</p>
                                                        <div className="w-full h-5 flex gap-2 justify-between items-center">
                                                            {Array.from({ length: 6 }).map((_, i) =>
                                                                <div className={`flex-1 h-full hover:scale-y-160 transition-all duration-125 ${i < futureTask.difficulty ? colors[i] : "bg-gray-100 hover:bg-gray-500"}`}
                                                                    onClick={() => { setFutureTask((prev) => ({ ...prev, difficulty: i + 1 })) }}></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="w-full h-[50px] flex justify-center items-center">
                                                    <div className={`w-[200px] h-full text-center text-[30px] font-medium bg-gray-100 hover:bg-black hover:scale-120 hover:text-white transition-all duration-150 rounded-md ${isTransmit ? "pointer-events-none" : ""}`}
                                                    onClick={async () => {
                                                        setTransmit(true)
                                                        const newTask: task = {
                                                            task_id: "",
                                                            title: futureTask.title,
                                                            desc: futureTask.desc,
                                                            difficulty: futureTask.difficulty,
                                                            is_completed: false
                                                        }
                                                        try {
                                                            const res = await AxiosInstance.post("/activity/task/assign", {
                                                                "date": getLocalDate(1),
                                                                "title": futureTask.title,
                                                                "desc": futureTask.desc,
                                                                "difficulty": futureTask.difficulty,
                                                                "is_completed": false
                                                            })
                                                            newTask.task_id = res.data.task_id
                                                        }
                                                        catch (e: any) {
                                                            console.log(e.response)
                                                        }
                                                        
                                                        if (newTask.task_id !== "") {
                                                            setView(newTask)
                                                            setNextGoal((prev) => {
                                                                const index = prev.findIndex(g => g.difficulty > newTask.difficulty)
                                                                if (index === -1) return [...prev, newTask]
                                                                return [...prev.slice(0, index), newTask, ...prev.slice(index)]
                                                            })
                                                            setFutureTask({ task_id: "",title: "", desc: "", difficulty: 1, is_completed: false })
                                                        }
                                                        setTransmit(false)
                                                    }}>
                                                        TẠO
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div className="w-full h-full flex flex-col items-center p-10 gap-5">
                                                <div className="w-full flex-1 text-center font-bold text-black text-[30px] relative">
                                                    <p>Kế hoạch tiếp theo</p> {/* đừng hỏi tại sao chỗ này viết 2 lần ạ T.T */}
                                                    <div className="w-full h-0.5 bg-gray-500/20 mb-5"></div>
                                                    <X className="w-10 h-10 absolute right-0 top-0 hover:scale-120 hover:text-red-500"
                                                        onClick={() => setMiniBar("")}></X>
                                                </div>
                                                {weight > 0 ?
                                                    <div className={`flex items-end h-10 justify-center text-[30px] gap-2 font-medium ${weight >= 15 ? "text-red-500 scale-120" : "text-black"}`}>
                                                        <Weight size={30} strokeWidth={2.5}></Weight>
                                                        <p className="leading-none">{weight >= 15 ? weight + ` !` : weight}</p>
                                                    </div>
                                                    :
                                                    <></>
                                                }

                                                <div className="w-full h-full overflow-y-scroll overflow-x-hidden">
                                                    {nextGoal.length ?
                                                        <div className="w-full flex flex-col justify-start items-center gap-5">
                                                            {nextGoal.map((v, i) =>
                                                                <div className="w-full h-[70px] flex bg-white/80 rounded-md text-black items-center hover:scale-x-95 hover:bg-gray-500/25 hover:border-2 hover:border-white duration-75 transition-all px-2">
                                                                    <div className="flex-1 p-5 flex items-center gap-5"
                                                                        onClick={() => { setView(v) }}>
                                                                        <div className={`w-10 h-10 rounded-full ${colors[v.difficulty - 1]}`}></div>
                                                                        <p className="font-medium text-[20px] italic line-clamp-1">{v.title}</p>
                                                                    </div>
                                                                    <div className={`w-[60px] h-[60px] flex justify-center items-center ${isTransmit ? "pointer-events-none" : ""}`}><Eraser size={35} strokeWidth={1.2}
                                                                        onClick={async () => {
                                                                            setTransmit(true)
                                                                            try {
                                                                                await AxiosInstance.post("/activity/task/modify", {
                                                                                    "task_id": v.task_id,
                                                                                    "action_type": "delete"
                                                                                })
                                                                            }
                                                                            catch (e: any) {
                                                                                console.log(e.response)
                                                                            }
                                                                            setNextGoal(prev => {
                                                                                const copy = [...prev]
                                                                                copy.splice(i, 1)
                                                                                return copy
                                                                            })
                                                                            setTransmit(false)
                                                                        }}
                                                                        className="text-red-500 opacity-80 hover:scale-150 hover:opacity-100 hover:text-white transition-all duration-200" /></div>
                                                                </div>
                                                            )}

                                                        </div>
                                                        :
                                                        <div className="w-full h-full flex justify-center items-center text-[25px] text-gray-500/60"><p>Hiện không có task cho ngày mai.</p></div>
                                                    }
                                                </div>
                                            </div>
                                        }
                                    </>
                                    :
                                    <></>
                                }
                            </>}
                    </div>
                </div>
            </div>
            :
            <div className="w-full h-full text-black flex justify-center items-center font-[350]"><p>LOADING PLEASE WAIT</p></div>
            }
        </main>
    )
}

export default GoalSession