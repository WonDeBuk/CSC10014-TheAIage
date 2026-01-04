import React, { useState, useEffect, useRef } from "react";
import pot from "../../../assets/Garden/pot.png"
import daisy from "../../../assets/Garden/daisy.png";
import rose from "../../../assets/Garden/rose.png"
import narcissus from "../../../assets/Garden/narcissus.png"
import seed from "../../../assets/Garden/seed.png"
import sprout from "../../../assets/Garden/sprout.png"
import sunflower from "../../../assets/Garden/sunflower.png"
import lilybell from "../../../assets/Garden/lilybell.png"
import { useAuth } from "@/app/providers/AuthProvider";
import { Sprout, ArrowBigUp, CircleCheckBig } from "lucide-react";
import AxiosInstance from "@/util/AxiosInstance";
import { useNavigate } from "react-router-dom";

type plant =
| "daisy"
| "rose"
| "narcissus"
| "lilybell"
| "sunflower"
| "sprout"
| "seed"

interface plantStatus {
    "plant_type": plant,
    "level": number,
    "exp": number,
    "max_exp": number
}

interface progresStatus {
    "previous_exp": number,
    "previous_level": number,
    "previous_max_exp": number,
}

interface quest {
    "type": "login" | "pomodoro" | "diary" | "mood" | "goal",
    "quota": number,
    "exp": number,
    "claimed": boolean
}

interface userProgress {
    "login": number,
    "pomodoro": number,
    "diary": number,
    "mood": number,
    "goal": number
}

const GardenSession = () => {
    const navigate = useNavigate()
    const { user, getLocalDate } = useAuth()    
    const plantMap = {
        "seed": seed,
        "sprout": sprout,
        "daisy": daisy,
        "rose": rose,
        "narcissus": narcissus,
        "lilybell": lilybell,
        "sunflower": sunflower
    }
    const questDesc = {
        "login": "Đăng nhập vào TheAIage.",
        "pomodoro": "Hoàn thành chu trình Pomodoro.",
        "diary": "Viết nhật ký.",
        "mood": "Đánh giá tâm trạng.",
        "goal": "Hoàn thành mục tiêu hằng ngày."
    }

    const getImg = () => {
        if (prevPlant && curPlant) {
            if (prevPlant.previous_level < 5) return plantMap["seed"]
            if (prevPlant.previous_level < 10) return plantMap["sprout"]
            return plantMap[curPlant.plant_type]
        }
    }

    const [curPlant, setPlant] = useState<plantStatus | null>(null)
    const [prevPlant, setPrevPlant] = useState<progresStatus | null>(null)

    const [progress, setProgress] = useState<userProgress | null>(null)
    const [gardenQuest, setQuest] = useState<quest[]>([])
    const [questFlag, setQuestFlag] = useState<boolean>(false)

    const [isPlant, setPlantRes] = useState(false)

    const plantList: Exclude<plant, "sprout" | "seed">[] = [
    "daisy",
    "rose",
    "narcissus",
    "lilybell",
    "sunflower"
    ]

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isForward, setForward] = useState<boolean>(true)

    const fetchPlant = async () => {
        try {
            const res = await AxiosInstance.get("/activity/garden/plant")
            const data = res.data
            setPlant({
                "plant_type": data.plant_type,
                "level": data.level,
                "exp": data.exp,
                "max_exp": data.max_exp
            })
            setPrevPlant({
                "previous_exp": data.previous_exp,
                "previous_level": data.previous_level,
                "previous_max_exp": data.previous_max_exp,
            })
        }
        catch (e: any) {
            setPlant(null)
            console.log(e.response)
        }
        setPlantRes(true)
    }

    const fetchQuest = async () => {
        try {
            const res = await AxiosInstance.get(`activity/quest/${getLocalDate()}`)
            setQuest(res.data)
            console.log(res.data)
        }
        catch (e: any) {
            setQuest([])
            console.log(e.response)
        }
    }

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const res = await AxiosInstance.get(`/activity/stats/${getLocalDate()}`)
                setProgress(res.data)
            }
            catch (e: any) {
                setProgress(null)
                console.log(e.response)
            }
        }

        fetchPlant()
        fetchQuest()
        fetchActivity()
    }, [])
  
    useEffect(() => {
        //happens when creating a new plant
        if (questFlag) {
            if (curPlant === null) fetchPlant()
            if (gardenQuest.length === 0) fetchQuest()
        }
    }, [questFlag])

    useEffect(() => {
        if (prevPlant && curPlant) {
            let goal = 0
            if (prevPlant.previous_level < curPlant.level && prevPlant.previous_exp < prevPlant.previous_max_exp) {
                goal = prevPlant.previous_max_exp
            }
            else if (prevPlant.previous_level === curPlant.level && prevPlant.previous_exp < curPlant.exp) {
                goal = curPlant.exp
            }

            if (goal > 0) {
                timerRef.current = setInterval(() => {
                    setPrevPlant(prev => {
                        if (!prev) return prev

                        let inc = 10
                        if (goal - prev.previous_exp > inc) {
                            setForward(true)
                            inc += prev.previous_exp
                        }
                        else {
                            setForward(false)
                            return {
                                previous_exp: (prev.previous_level === curPlant.level) ? curPlant.exp : 0,
                                previous_level: curPlant.level,
                                previous_max_exp: curPlant.max_exp,
                            }
                        }
                        return {
                            previous_exp: inc,
                            previous_level: prev.previous_level,
                            previous_max_exp: prev.previous_max_exp,
                        }
                    })
                }, 100)
            }
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }

    }, [prevPlant, curPlant])

    return (
        <main className="flex-1 hero-bg p-5 overflow-auto select-none pt-25" onClick={() => console.log(curPlant, prevPlant)}>
            {isPlant && progress ? <div className="w-full h-full flex items-center">
                <div className="w-[700px] h-full rounded-md flex flex-col gap-6 items-center p-5">
                    <div className="w-[300px] h-[75px] rounded-full bg-white/60 shadow-md flex gap-7 items-center px-10">
                        <Sprout className="text-lime-600" size={50} strokeWidth={1.3}></Sprout>
                        <p className="text-[25px] font-medium">{user?.username}</p>
                    </div>
                    <div className="w-full h-[430px] relative border-2 border-b-0 border-white rounded-full">
                        <img src={pot} className="max-w-[500px] w-full h-auto scale-120 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 absolute"/>
                        {curPlant ? <img src={getImg()} className="max-w-[500px] w-full h-auto scale-120 top-1/2 left-1/2  -translate-y-1/2 -translate-x-1/2 absolute"/> : <></> }
                    </div>
                    {curPlant && prevPlant ? 
                    <div className="w-full flex flex-col flex-1 gap-5">
                        <div className="h-[60px] w-fit flex items-center bg-white/60 gap-5 p-5 shadow-md rounded-full font-medium text-[22px]">
                            <ArrowBigUp size={30} className="text-gray-500"></ArrowBigUp>
                            <p>LEVEL {prevPlant.previous_level} / 20</p>
                        </div>
                        
                        <div className="w-full flex flex-col gap-1">
                            <div className="font-[350] text-[25px] text-black text-left">{prevPlant.previous_exp} / {prevPlant.previous_max_exp} EXP</div>
                            <div className="w-full h-[30px] rounded-full shadow-md p-2 bg-white">
                                <div className="bg-gray-200 w-full h-full rounded-full">
                                    <div className={`h-full bg-blue-500 rounded-full ${isForward ? "transition-[width] duration-200 ease-out" : ""}`}
                                    style={{ width: `${prevPlant.previous_exp / prevPlant.previous_max_exp * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="w-full flex justify-center gap-2 items-center translate-y-full">
                        {isPlant ?
                        <>
                        {plantList.map((p, _) =>
                            <div className="p-5 h-[75px] text-black text-[22px] font-medium flex items-center bg-white/50 rounded-full hover:bg-white/80 hover:scale-110 transition-all duration-100"
                            onClick={async () => {
                                try {
                                    await AxiosInstance.get(`/activity/garden/create/${getLocalDate()}/${p}`)
                                    setQuestFlag(true)
                                }
                                catch (e: any) {
                                    console.log(e.response)
                                }
                            }}><p>{p.toUpperCase()}</p></div>
                        )}
                        </>
                        :
                        <></>
                        }
                    </div>
                    }
                </div>
                <div className="flex-1 flex flex-col justify-start items-center h-full p-5 gap-3">
                    <div className="font-medium text-[30px] bg-white rounded-full shadow-md py-3 px-6">QUESTS</div>
                    <div className="flex-1 w-full flex flex-col gap-3 items-center justify-start px-10">
                        {gardenQuest.map((q, _) => 
                            <div className={`bg-white/80 min-h-[100px] text-[26px] font-[380] w-full rounded-full flex items-center p-5 gap-5 ${q.claimed ? "opacity-50 pointer-events-none" : "border-2 border-blue-500 hover:-translate-x-5 transition-all duration-100 hover:bg-white"}`}
                            onClick={() => {
                                navigate(`/study/?session=${q.type}`)
                            }}>
                                <div className="flex flex-1 flex-col h-fit p-2 gap-2">
                                    <p>{questDesc[q.type]}</p>
                                    <div className="w-full h-4 bg-gray-200 rounded-full">
                                        <div className="h-full bg-blue-500 rounded-full"
                                        style={{width: `${Math.min(progress[q.type], q.quota) / q.quota * 100}%`}}>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[50px] text-[22px]">{Math.min(progress[q.type], q.quota)} / {q.quota}</div>
                                <div className="w-[125px] h-[50px] text-[22px] bg-blue-500 text-white rounded-full p-2 flex justify-center items-center"><p>{q.claimed ? "DONE" : q.exp + " EXP"}</p></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>        
            :
            <div className="w-full h-full text-black flex justify-center items-center font-[350]"><p>LOADING PLEASE WAIT</p></div>
            }
        </main>
    )
}

export default GardenSession