import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { FolderPen, X, Pen, Trash2 } from "lucide-react";
import AxiosInstance from "@/util/AxiosInstance";

interface diaryRecord {
    date: string,
    content: string,
}

const DiarySession = () => {
    const { getLocalDate } = useAuth()
    const [curDiary, setCurValue] = useState<diaryRecord>({date: getLocalDate(0), content: ""})
    const [inHistory, setHistory] = useState<boolean>(false)
    const [diaryHistory, setDiaryHistory] = useState<diaryRecord[]>([curDiary])

    const [isTransmit, setTransmit] = useState<boolean>(false)

    const [hasHistory, setHasHistory] = useState<boolean>(false)
    const [hasCurrent, setHasCurrent] = useState<boolean>(false)


    const fetchDatedDiary = async (offset: number) => {
        try {
            const res = await AxiosInstance.get(`/activity/diary/${getLocalDate(offset)}`)
            return res.data
        }
        catch (e: any) {

        }
        return null
    }

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await AxiosInstance.get("/activity/diary/records")
                const history = res.data
                if (history.length && history[history.length - 1].date != getLocalDate(0)) {
                    setDiaryHistory([{
                        "date": getLocalDate(0),
                        "content": ""
                    }, ...history])
                }
                else 
                    setDiaryHistory(history)
              
            }
            catch (e: any) {
                console.log(e.response)
            }
            setHasHistory(true)
        }

        const fetchTodayDiary = async () => {
            const res = await fetchDatedDiary(0)
            if (res) setCurValue((prev) => ({...prev, content: res.content}))
            setHasCurrent(true)
        }

        fetchHistory()
        fetchTodayDiary()
    }, [])

    return (
        <main className={`flex-1 hero-bg pt-32 p-10 relative ${isTransmit ? "pointer-events-none" : ""}`}>
            {hasCurrent && hasHistory ?
            <>
            {inHistory ? <div className={`w-full h-full bg-black/50 top-0 left-0 absolute`}
            onClick={() => setHistory(false)}></div> : <></>}
            <div className="flex items-center justify-between w-full h-full relative">
                {inHistory ? <div className="bg-white rounded-md w-[900px] top-1/2 left-1/2 -translate-1/2 h-full absolute flex flex-col p-5">
                    <div className="w-full flex-1 flex flex-col gap-1 select-none">
                        <div className="w-full h-full flex justify-between items-center py-2">
                            <p className="font-medium text-[40px]">BẢN LƯU GIỮ NHẬT KÝ</p>
                            <X size={40} strokeWidth={1.4} onClick={() => setHistory(false)} className="hover:text-red-500 hover:scale-120 transition-all duration-100"></X>
                        </div>
                        <div className="w-full h-0.5 bg-gray-500/50"></div>
                    </div>
                    <div className="w-full h-[650px] flex flex-col">
                        {diaryHistory.length ?
                        <div className="w-full h-full flex flex-col gap-2 items-center overflow-y-scroll overflow-x-hidden px-7 py-2 select-none">
                            <div className="w-full h-[90px] transition-all duration-150 group flex items-center justify-end">
                                <div className={`w-full h-full flex justify-center items-center transition-[width] duration-300 px-5 py-2 gap-3 bg-gray-300 scale-90 rounded-md`}>
                                    <div className="h-full flex-1">
                                        <p className="text-[22px] font-medium">{curDiary.date.split('-').reverse().join('-')}</p>
                                        <p className="text-[20px] text-gray-500/70 line-clamp-1">{curDiary.content}</p>
                                    </div>
                                    <div className="w-[50px] h-[50px] flex justify-center items-center text-gray-500 hover:bg-black hover:text-white transition-all duration-150 rounded-full hover:scale-120"
                                    onClick={() => {
                                        setHistory(false)
                                    }}>
                                        <Pen></Pen>
                                    </div>
                                    <div className={`w-[50px] h-[50px] flex justify-center items-center text-gray-500 hover:bg-black hover:text-white transition-all duration-150 rounded-full hover:scale-120 ${curDiary.content ? "" : "opacity-50 pointer-events-none"}`}
                                    onClick={async () => {
                                        setTransmit(true)
                                        try {
                                            await AxiosInstance.post("/activity/diary/modify", {
                                                "action_type": "delete",
                                                "date": curDiary.date
                                            })
                                            setDiaryHistory((prev) =>  {
                                            const index = prev.findIndex(d => d.date === curDiary.date)
                                            if (index === -1) return prev
                                            const copy = [...prev]
                                            copy.splice(index, 1)
                                            return copy
                                            })
                                        }
                                        catch (e: any) {

                                        }
                                        const norm = await fetchDatedDiary(0)
                                        setCurValue({"date": getLocalDate(0), "content": norm ? norm.content : "" })
                                        setHistory(false)
                                        setTransmit(false)
                                    }}>
                                        <Trash2></Trash2>
                                    </div>
                                </div>
                            </div>
                            {diaryHistory.filter(d => d.date != curDiary.date).map((diary, index) =>
                            <div className="w-full h-[90px] transition-all duration-150 group flex items-center justify-end">
                                <div className={`w-full h-full flex justify-center items-center transition-[width] duration-300 px-5 py-2 gap-3 ${getLocalDate(0) === diary.date ? "bg-[#edeaca]" : "bg-gray-100" } group-hover:bg-white group-hover:w-4/5 group-hover:border-black group-hover:border-2 group-hover:rounded-l-full group-hover:rounded-r-md group-hover:pl-7" : "bg-gray-300 scale-95 rounded-md transition-all`}>
                                    <div className="h-full flex-1">
                                        <p className="text-[22px] font-medium">{diary.date.split('-').reverse().join('-')}</p>
                                        <p className="text-[20px] text-gray-500/70 line-clamp-1">{diary.content}</p>
                                    </div>
                                    <div className="w-[50px] h-[50px] flex justify-center items-center text-gray-500 hover:bg-black hover:text-white transition-all duration-150 rounded-full hover:scale-120"
                                    onClick={() => {
                                        setCurValue(diary)
                                        setHistory(false)
                                    }}>
                                        <Pen></Pen>
                                    </div>
                                    <div className="w-[50px] h-[50px] flex justify-center items-center text-gray-500 hover:bg-black hover:text-white transition-all duration-150 rounded-full hover:scale-120"
                                    onClick={async () => {
                                        setTransmit(true)
                                        try {
                                            await AxiosInstance.post("/activity/diary/modify", {
                                                "action_type": "delete",
                                                "date": diary.date
                                            })

                                            setDiaryHistory((prev) =>  {
                                            const index = prev.findIndex(d => d.date === diary.date)
                                            if (index === -1) return prev
                                            const copy = [...prev]
                                            copy.splice(index, 1)
                                            return copy
                                        })
                                        }
                                        catch (e: any) {

                                        }
                                        setTransmit(false)
                                    }}>
                                        <Trash2></Trash2>
                                    </div>
                                </div>
                            </div>
                            )}
                        </div>
                        :
                        <div className="w-full h-full flex justify-center items-center text-gray-500/60">
                            <p>Không tìm thấy bản ghi nào.</p>
                        </div>
                        }
                    </div>
                </div> : <></>}
      
                <div className={`flex-1 h-full flex flex-col items-center justify-center`}>
                    <div className="w-[100px] h-[100px] bg-white text-gray-600 font-light p-2 rounded-full flex justify-center items-center text-[25px] hover:scale-120 hover:text-black transition-all duration-150"
                    onClick={() => setHistory(!inHistory)}>
                        <FolderPen size={60} strokeWidth={1.3}></FolderPen>
                    </div>
                </div>
                <div className={`w-[1300px] h-full flex flex-col gap-2 items-center ${inHistory ? "pointer-events-none" : ""}`}>
                    <div className={`w-[300px] h-[50px] p-3 rounded-md shadow-md flex justify-center items-center select-none ${curDiary.date === getLocalDate(0) ? "bg-yellow-500/50 text-white" : "bg-gray-400/50 text-gray-500"}`}>
                        <p className="text-center text-[35px] font-light itali">{curDiary.date.split("-").reverse().join("-")}</p>
                    </div>
                    <textarea
                    className="w-full flex-1 text-[25px] leading-10 resize-none outline-none overflow-y-scroll overflow-x-hidden bg-origin-content bg-clip-content
                    bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_2.4rem,rgba(0,0,0,0.15)_2.5rem)] p-3
                    border-3 border-black rounded-md"
                    placeholder="Dear diary,"
                    value={curDiary.content}
                    onChange={(e) => setCurValue((prev) => ({...prev, content: e.target.value}))}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            e.currentTarget.blur();
                        }
                    }}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoComplete="off"
                    />
                    
                    <div className="w-full h-[50px] flex justify-end items-center">
                        {!inHistory ? 
                        <div className="bg-blue-500 font-bold text-white text-[35px] text-center flex justify-center items-center rounded-md h-full w-[200px] hover:bg-white hover:border-blue-500 hover:border-2 hover:text-blue-500 transition-all duration-150 select-none"
                        onClick={async () => {
                            setTransmit(true)
                            try {
                                await AxiosInstance.post("/activity/diary/modify", {
                                    "date": curDiary.date,
                                    "action_type": "edit",
                                    "content": curDiary.content
                                })

                                setDiaryHistory(prev => {
                                    const index = prev.findIndex(d => d.date === curDiary.date)
                                    if (index === -1) {
                                        return [...prev, {"date": curDiary.date, "content": curDiary.content}]
                                    }
                                    const exist = [...prev]
                                    exist[index] = {
                                        ...exist[index],
                                        "content": curDiary.content
                                    }
                                    return exist 
                                })

                                if (curDiary.date === getLocalDate(0)) {    
                                    await AxiosInstance.post("/activity/match", {
                                        "activity_type": "diary",
                                        "date": curDiary.date
                                    })
                                }
                            }
                            catch (e: any) {
                                
                            }
                            setTransmit(false)
                        }}>
                            <p>LƯU</p>
                        </div>
                        : <></>
                        }
                    </div>
                </div>
            </div>
            </>
            :
            <div className="w-full h-full text-black flex justify-center items-center font-[350]"><p>LOADING PLEASE WAIT</p></div>
            }
        </main>
    )
}

export default DiarySession