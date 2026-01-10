import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import '@/presentation/pages/ChatPage/ChatPage.css';
import { useAuth } from "@/app/providers/AuthProvider";
import AxiosInstance from "@/util/AxiosInstance";
import { MessageCircleMore, Bot, Search, UserSearch, CalendarFold, LogOut, User, FastForward, Target } from "lucide-react"
import { io, Socket } from "socket.io-client";
import { Headset, CircleUser, Plus, Trash2, BookMarked, X } from "lucide-react";

interface message {
    sender_id: string,
    content: string
}

interface thread {
    created_at: string,
    conversation_id: string,
    last_sender_id: string,
    last_message_content: string
}

interface diagnose {
    score: number,
    content: string,
    total_guess: string
}

export default function ChatPageAI() {
    const [searchParams] = useSearchParams();
    const targetFind = searchParams.get("thread");
    const targetConvo = useRef<string | null>(null)
    const { user } = useAuth();
    const navigate = useNavigate()
    const [msgList, setMsgList] = useState<message[]>([])
    const [threadList, setthreadList] = useState<thread[]>([])
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isResponding, setIsResponding] = useState<boolean>(false)

    const [messageContent, setMessageContent] = useState("")
    const textArea = useRef<HTMLTextAreaElement>(null);
    const lastMsg = useRef<HTMLDivElement>(null)

    const [searchQuery, setSearchQuery] = useState("")
    const [filteredThreadList, setFilteredThreadList] = useState<thread[]>([])

    const [diagnose, setDiagnose] = useState<diagnose | null>(null)
    const [diagnosePopUp, setDiagnosePopUp] = useState(false)

    const [hasAllThreads, setHasAllThreads] = useState<boolean>(false)
    const [hasThreadInfo, setHasThreadInfo] = useState<boolean>(targetFind === null)
    const [hasNewThread, setHasNewThread] = useState<boolean>(false)

    const scoreColor = [
        "text-blue-500",
        "text-lime-500",
        "text-yellow-500",
        "text-orange-500",
        "text-red-500"
    ]

    async function fetchMessages() {
        try {
            const rep = await AxiosInstance.get(`chat/message/ai/${targetFind}`)
            setMsgList(rep.data)
        }
        catch (e: any) {
            navigate("/chatai")
            console.log(e)
        }
        setHasThreadInfo(true)
    }

    useEffect(() => {
        if (!localStorage.getItem("token")) navigate("/login")

        const newSocket = io("http://localhost:8000", {
            withCredentials: true,
            auth: {
                token: localStorage.getItem("token") || ""
            }
        });

        newSocket.on("connect", () => {
            console.log("Connected to websocket");
        });

        newSocket.on("connect_error", (err) => {
            console.error("Connection error:", err);
        });

        newSocket.on("client_receive_message", (data) => {
            if (data.conversation_id === targetConvo.current) {
                setMsgList(prev => [...prev, {
                    sender_id: "TheAIagent",
                    content: data.content
                }])
            }
            
            setthreadList((prev) => {
                const index = prev.findIndex(t => t.conversation_id === data.conversation_id)
                if (index !== -1) {
                    const next = [...prev]
                    next[index] = {
                        ...next[index],
                        last_sender_id: "TheAIagent",
                        last_message_content: data.content
                    }
                    return next
                }
                return prev
            })
        });

        newSocket.on("thread_created", (data) => {
            setthreadList((prev) => [{created_at: data.created_at, conversation_id: data.conversation_id, last_sender_id: "TheAIagent", last_message_content: data.content}, ...prev])
            navigate(`/chatai?thread=${data.conversation_id}`);
            setHasNewThread(false)
        });

        const fetchConversations = async () => {
            try {
                const list = await AxiosInstance.get(`/chat/conversation/ai/${-new Date().getTimezoneOffset() / 60}`)
                setthreadList(list.data)
            }
            catch (e: any) {
                console.log(e)
            }
            setHasAllThreads(true)
        }

        newSocket.on("update_diagnosis", (data) => {
            setDiagnose(data)
            setDiagnosePopUp(true)
        })

        fetchConversations()
        if (targetFind) fetchMessages()
        setSocket(newSocket);

        return () => {
            if (socket) {
                socket.removeAllListeners();
                socket.disconnect();
            }
        }
    }, [])

    useEffect(() => {
        const fetchDiagnose = async () => {
            try {
                const res = await AxiosInstance.get(`/chat/thread/diagnosis/${targetFind}`)
                setDiagnose(res.data)
                console.log("DIAGNOSE:", res.data)
            }
            catch (e: any) {
                setDiagnose(null)
            }
        }

        if (targetFind) {
            fetchMessages()
            fetchDiagnose()
        }
        targetConvo.current = targetFind
        setDiagnosePopUp(false)
    }, [targetFind])

    useEffect(() => {
        if (targetFind) {
            const index = threadList.findIndex(t => t.conversation_id === targetFind)
            if (index !== -1) {
                if (threadList[index].last_sender_id !== "TheAIagent") {
                    setIsResponding(true)
                }
                else setIsResponding(false)
            }
        }

        if (lastMsg) 
            lastMsg.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            })
    }, [msgList])

    useEffect(() => {
        if (searchQuery !== "") {
            const filtered: thread[] = threadList.filter(thread =>
                thread.created_at.toLowerCase().includes(searchQuery.toLowerCase()) ||
                thread.last_message_content.toLowerCase().includes(searchQuery.toLowerCase()))
            setFilteredThreadList(filtered)
        }
        else setFilteredThreadList(threadList)
    }, [threadList, searchQuery])

    return (
        <div className={`hero-bg h-full w-full fixed flex items-center gap-7 p-5`}>

            <div className="bg-black/20 h-full w-[120px] rounded-2xl flex flex-col items-center justify-between gap-10 p-8">
                <div className="bg-blue-50/0 h-20 w-20 rounded-full flex justify-center items-center hover:scale-105 hover:bg-black text-white transition-all outline-2 outline-white hover:outline-black duration-150 text-[25px] font-medium"
                onClick={() => navigate("/personal")}><p>YOU</p></div>

                <div className="w-full flex-1 rounded-2xl">
                    <div className="w-full h-auto flex flex-col items-center gap-5 *:flex *:justify-center *:items-center *:text-white">
                        <div onClick={() => navigate("/chat")} className="w-20 h-20 group transition-all duration-200 "><MessageCircleMore size={30} className="group-hover:scale-150 transition-transform duration-200" /></div>
                        <div className="w-20 h-20 items-center rounded-full outline-white outline-2"><Bot size={45} className="group-hover:scale-150 transition-transform duration-200" /></div>
                        <div onClick={() => navigate("/counsellors")} className="w-20 h-20 group transition-all duration-200"><UserSearch size={30} className="group-hover:scale-150 transition-transform duration-200" /></div>
                        <div onClick={() => navigate("/study")} className="w-20 h-20 group transition-all duration-200"><CalendarFold size={30} className="group-hover:scale-150 transition-transform duration-200" /></div>
                    </div>
                </div>

                <div className="hover:scale-120 transition-all duration-200 w-20 h-20 rounded-lg hover:bg-black/60 flex justify-center items-center" onClick={() => { navigate('/') }}><LogOut size={40} strokeWidth={2} className="text-white" /></div>
            </div>

            {hasAllThreads && hasThreadInfo && !hasNewThread ?
            <>
            <div className={`h-full flex-1 flex flex-col items-center gap-5 justify-between select-none ${!user || isResponding ? "pointer-events-none" : ""}`}>
                <div className="w-full h-fit flex items-center gap-2">
                    <div className={`h-[75px] w-[75px] rounded-2xl bg-white flex justify-center items-center hover:scale-120 transition-transform duration-200 ${!targetFind ? "pointer-events-none opacity-50" : ""}`}
                    onClick={()=>{
                        navigate("/chatai")}}>
                        <Plus size={50} strokeWidth={1} className="text-gray-500"></Plus>
                    </div>
                    <div className={`h-[75px] w-[75px] rounded-2xl bg-white flex justify-center items-center ${targetFind ? "hover:scale-120 transition-transform duration-200" : "opacity-50"}`}
                    onClick={async () => {
                        try {
                            await AxiosInstance.post("/chat/thread/delete", {
                                "conversation_id": targetFind
                            })

                            setthreadList((prev) => {
                                const index = prev.findIndex(t => t.conversation_id === targetFind)
                                if (index === -1) return prev
                                const copy = [...prev]
                                copy.splice(index, 1)
                                return copy
                            })
                            navigate("/chatai")
                        }
                        catch (e: any) {
                            console.log(e.response)
                        }
                    }}>
                        <Trash2 size={50} strokeWidth={1} className="text-gray-500"></Trash2>
                    </div>
                    <div className="bg-white flex-1 h-[75px] rounded-2xl px-3 py-4 flex items-center justify-center gap-2">
                        <Search size={32} strokeWidth={1.5} className="text-gray-200" />
                        <input className="bg-gray-100 w-full h-full rounded-md text-[15px] px-3" placeholder="Tìm kiếm đoạn chat." value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                e.currentTarget.blur()
                            }
                        }}></input>
                    </div>
                </div>

                <div className="w-full h-[775px] rounded-md p-2">
                    {filteredThreadList.length ? (
                        <div className="flex flex-col gap-2 items-center h-full overflow-y-scroll overflow-x-hidden">
                            {filteredThreadList.map((thread, index) => 
                            <div className="w-full flex flex-col justify-start items-center gap-2 px-3 py-2 bg-white rounded-md">
                                <div className={`w-full h-full flex flex-col justify-start items-center gap-1 hover:translate-x-1.5 hover:bg-gray-100 p-3 rounded-md transition-all duration-100 ${targetFind === thread.conversation_id ? "bg-gray-200" : ""}`}
                                onClick={() => {
                                    navigate(`/chatai?thread=${thread.conversation_id}`)}
                                }>
                                    <div className="w-full font-md text-[25px]">{thread.created_at}</div>
                                    <div className="w-full text-[15px] font-light line-clamp-1">{thread.last_message_content}</div>
                                </div>
                            </div>
                            )}
                        </div>
                    ) : (
                        <div className="px-15 w-full h-full text-[22px] text-gray-400 flex flex-col justify-center items-center">
                            <p className="text-center w-full">Không tìm thấy cuộc trò chuyện...</p>
                        </div>
                    )}
                </div>
            </div>

            {targetFind ? (
                <div className="h-full w-[1200px] rounded-2xl flex flex-col gap-0 relative">

                    <div className="w-full h-[100px] flex flex-col gap-0 justify-center items-center">
                        <div className="w-full flex-1 flex gap- items-center rounded-t-2xl px-6 gap-3">
                            <div className="w-[90px] h-[90px] flex justify-center items-center"><Headset size={60} strokeWidth={1.0} className="text-pink-700" /></div>
                            <div className="h-full flex items-center gap-0 text-left">
                                <p className="text-[40px] font-light">TheAIage</p>
                            </div>
                            <div className={`flex-1 flex justify-end items-center ${diagnose !== null ? "" : "opacity-50 pointer-events-none"}`}>
                                <BookMarked size={50} strokeWidth={1} className="hover:scale-130 duration-150 transition-all hover:stroke-[1.3]"
                                onClick={() => setDiagnosePopUp(!diagnosePopUp)}></BookMarked>
                            </div>
                        </div>
                    </div>

                    
                    <div className={`select-none w-[500px] max-h-[780px] overflow-y-auto overflow-x-hidden absolute top-[90px] p-5 -right-15 bg-white rounded-md border-3 border-black z-20 transition-all duration-150 flex flex-col justify-between ${diagnosePopUp ? "visible opacity-100 right-5" : "invisible opacity-0"}`}>
                        <div className="h-[50px] flex flex-col items-center relative justify-center">
                            <p className="font-medium">KẾT QUẢ CHẨN ĐOÁN</p>
                            <X className="absolute right-5 hover:scale-150 hover:text-red-500 transition-all duration-100" strokeWidth={1.7} size={30} onClick={() => setDiagnosePopUp(false)}></X>
                            <div className="w-full h-0.5 bg-gray-500/20"></div>
                        </div>

                        <div className="w-full flex-1 flex flex-col items-center gap-3">
                            <div className="w-full h-[220px] p-2">
                                <div className="w-full flex flex-col justify-center items-center">
                                    <p className="text-[40px] font-medium">SCORE</p>
                                </div>
                                <div className="w-full h-fit p-3 flex flex-col justify-center items-center">
                                    <div className={`w-full flex justify-center items-center text-[70px] font-bold ${diagnose && diagnose.score ? scoreColor[Math.floor((diagnose.score - 1) / 2)] : "bg-gray-500"}`}><p>{diagnose?.score}</p></div>
                                    <div className="w-full flex justify-center items"><p className="text-center text-[14px] text-gray-500">{`(Trên thang 1 đến 10 từ ít nghiêm trọng cho đến nghiêm trọng.)`}</p></div>
                                </div>
                                <div className="w-full h-0.5 bg-gray-500/20"></div>
                            </div>

                            <div className="w-full h-fit flex justify-center items-center p-2 pt-4">
                                <p className="text-gray-600 text-[18px] text-center">"{diagnose?.content}"</p>
                            </div>

                            <div className="w-full flex flex-col items-center p-2 pb-0 gap-4">
                                <div className="w-full flex flex-col justify-center items-center text-[40px] font-medium">
                                    <p>CHẨN ĐOÁN</p>
                                    <div className="w-full h-0.5 bg-gray-500/20"></div>
                                </div>
                                <div className="w-full flex justify-center items-center text-[24px] font-[425] text-red-600"><p className="text-center">{diagnose?.total_guess}</p></div>
                            </div>
                    
                            <div className="w-full h-20 flex items-center justify-center p-3">
                                <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center rounded-md hover:scale-105 hover:bg-white hover:text-blue-500 hover:border-2 hover:border-blue-500 transition-all duration-150"
                                onClick={() => navigate("/counsellors")}><p>NÓI CHUYỆN VỚI TƯ VẤN VIÊN</p></div>  
                            </div>        
                        </div>
                    </div>

                    <div className={`w-full flex-1 flex flex-col overflow-y-auto overflow-x-hidden gap-5 px-5 py-3 border-t border-black transition-all duration-150`}>
                        {msgList.length ? (
                            msgList.map((msg, index) =>
                                <div key={index} className={`flex text-[15px] text-white items-center w-full ${msg.sender_id === user?.user_id ? "justify-end" : "justify-start"} ${diagnosePopUp ? "opacity-30" : ""}`}
                                ref={index===msgList.length-1 ? lastMsg : null}>
                                    <div className={`text-left max-w-2/3     p-3 rounded-2xl text-[18px] whitespace-pre-wrap ${msg.sender_id !== "TheAIagent" ? "bg-blue-500" : "bg-gray-500"}`}>{msg.content}</div>
                                </div>
                            )
                        ) : (
                            <></>
                        )}
                    </div>

                    <div className={`w-full h-[120px] rounded-b-2xl px-5 py-2 ${isResponding ? "pointer-events-none" : ""}`}>
                        <textarea className="w-full h-full text-[16px] rounded-2xl bg-white p-3 overflow-hidden"
                            disabled={isResponding}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                setMessageContent(e.target.value)
                            }}
                            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                                const rf = textArea.current
                                if (!rf) return
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    if (!e.shiftKey) {
                                        if (messageContent.trim() === "") {
                                            setMessageContent("");
                                            return;
                                        }
                                        if (!socket) {
                                            console.error("Socket not connected");
                                            return;
                                        }
                                        const sent_msg: message = {
                                            sender_id: user?.user_id || "",
                                            content: messageContent
                                        }
                                        setMsgList(prev => [...prev, sent_msg])
                                        setthreadList((prev) => {
                                            const index = prev.findIndex(t => t.conversation_id === targetFind)
                                            if (index !== -1) {
                                                const next = [...prev]
                                                next[index] = {
                                                    ...next[index],
                                                    last_sender_id: user?.user_id || "",
                                                    last_message_content: messageContent
                                                }
                                                return next
                                            }
                                            return prev
                                        })
                                        socket.emit("client_send_message", {
                                            recipient_id: "TheAIagent",
                                            recipient_role: "AI",
                                            content: messageContent,
                                            conversation_id: targetFind
                                        })
                                        setMessageContent("")
                                    }
                                    else setMessageContent((prev) => prev + "\n");
                                }
                            }}
                            ref={textArea} value={messageContent}
                            placeholder="Trò chuyện ở đây."
                        ></textarea>
                    </div>
                </div>
            ) :
            (
                <div className="w-[1200px] flex flex-col justify-center items-center gap-1">
                    <p className="text-[50px] text-gray-600 w-[800px] text-center font-[650] select-none">TheAIage chào bạn.</p>
                    <p className="text-[30px] text-gray-400 w-[800px] text-center select-none">Hôm nay bạn cảm thấy như thế nào?</p>
                    <div className="relative w-[800px]">
                        <textarea
                            disabled={isResponding}
                            className="bg-white w-full h-[120px] text-[18px] rounded-lg p-5 resize-none
                            outline-gray-300 focus:outline-blue-400 focus:outline-2"
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                            onKeyDown={(e) => {
                                if (!socket) return
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    setHasNewThread(true)
                                    socket.emit("start_new_thread", {content: messageContent, time_offset: -new Date().getTimezoneOffset() / 420})
                                    setMessageContent("")
                                }
                            }}
                        />

                        {messageContent === "" && (
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-gray-400 text-[22px]">
                                Trò chuyện ở đây.
                            </div>
                        )}
                    </div>
                </div>
            )}
            </>
            :
            <div className="w-full h-full text-black flex justify-center items-center font-[350]"><p>LOADING PLEASE WAIT</p></div>
            }
        </div>
    )
}