import React, { useState, useEffect, use } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import '@/presentation/pages/ChatPage/ChatPage.css';
import { useAuth } from "@/app/providers/AuthProvider";
import AxiosInstance from "@/util/AxiosInstance";
import { MessageCircleMore, Bot, Search, UserSearch, CalendarFold, LogOut, User, FastForward, Target, Info } from "lucide-react"
import { io, Socket } from "socket.io-client";
import { Heart, CircleUser, X } from "lucide-react";

interface message {
    sender_id: string,
    content: string
}

interface conversation {
    other_user_id: string,
    other_email: string,
    other_username: string,
    other_role: string,
    conversation_id: string,
    last_sender_id: string,
    last_message_content: string
}

interface profile {
    user_id: string,
    username: string,
    email: string,
    role: string,
    // description: string,
    // expertise: string,
    conversation_id: string
}

interface summarization {
    summary: string,
    key_points: string[],
    important_details: string[],
    emotions_detected: string,
    next_steps: string[]
}

export default function ChatPage() {
    const [searchParams] = useSearchParams();
    const targetFind = searchParams.get("chat");
    const { user } = useAuth();
    const navigate = useNavigate()
    const [msgList, setMsgList] = useState<message[]>([])
    const [convList, setConvList] = useState<conversation[]>([])
    const [targetUser, setTargetUser] = useState<profile | null>(null)
    const [socket, setSocket] = useState<Socket | null>(null);

    const [isPopup, setIsPopup] = useState<boolean>(false)
    const [recap, setRecap] = useState<summarization | null>(null)

    const [filteredConvList, setFilteredConvList] = useState<conversation[]>([])
    const [searchQuery, setSearchQuery] = useState("")

    const [messageContent, setMessageContent] = useState("")
    const textArea = React.useRef<HTMLTextAreaElement>(null);
    const searchArea = React.useRef<HTMLInputElement>(null);

    const lastMsg = React.useRef<HTMLDivElement>(null)

    const fetchMessages = async () => {
        if (!targetFind) return;
        try {
            const list = await AxiosInstance.get(`/chat/message/human/${targetFind}`)
            setMsgList(list.data)
        }
        catch (e: any) {
            console.log(e)
        }
    }

    useEffect(() => {
        // if (!user) navigate("/login")

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
            const newMessage = {
                conversation_id: data.conversation_id,
                sender_id: data.sender_id,
                content: data.content
            }
            console.log(data, "but user is in: ", targetUser?.user_id || "")

            if (targetUser && targetUser.user_id === data.sender_id) setMsgList(prev => [...prev, newMessage])
            setConvList(prev => {
                const index = prev.findIndex(c => c.other_user_id == data.sender_id);
                if (index === -1) return prev
                const copy = [...prev];
                const conv = copy.splice(index, 1)[0];
                conv.last_message_content = data.content;
                conv.last_sender_id = data.sender_id;
                return [conv, ...copy];

            });
        });

        newSocket.on("new_conversation", (data) => {
            setConvList(prev => [data, ...prev])
            if (targetFind === data.other_email) {
                const newPayload = {
                    user_id: data.other_user_id,
                    username: data.other_username,
                    email: data.other_email,
                    role: data.other_role,
                    conversation_id: data.conversation_id
                }
                setTargetUser(newPayload)
            }
        });

        const fetchConversations = async () => {
            try {
                const list = await AxiosInstance.get("/chat/conversation/human")
                setConvList(list.data)
            }
            catch (e: any) {
                console.log(e)
            }
        }

        fetchConversations()
        setSocket(newSocket);
        if (targetFind) {
            fetchMessages()
        }

        return () => {
            if (socket) {
                socket.disconnect();
                socket.removeAllListeners();
            }
        }
    }, [])

    useEffect(() => {
        const fetchTargetUser = async () => {
            if (!targetFind) return;
            try {
                const profileData = await AxiosInstance.get(`/auth/info/${targetFind}`)
                setTargetUser(profileData.data)
            }
            catch (e: any) {
                console.log(e)
                return;
            }
        }
        if (!targetUser) fetchTargetUser() //new conversation case, as in the conversation does not exist yet
    }, [targetFind])

    useEffect(() => {
        if (targetUser) fetchMessages()
    }, [targetUser])

    useEffect(() => {
        if (lastMsg.current) lastMsg.current.scrollIntoView()
    }, [msgList])

    useEffect(() => {
        if (searchQuery !== "") {
            const filtered: conversation[] = convList.filter(conv =>
                conv.other_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                conv.other_email.toLowerCase().includes(searchQuery.toLowerCase()))
            setFilteredConvList(filtered)
        }
        else setFilteredConvList(convList)
    }, [convList, searchQuery])

    return (
        <div className="hero-bg h-full w-full flex items-center gap-7 p-5 relative overflow-hidden">
            {isPopup ? <>
                <div className="bg-black/20 w-full h-full absolute scale-200"
                    onClick={() => (setIsPopup(false))}></div>
                <div className="w-[1200px] h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute bg-white rounded-2xl flex flex-col p-3">
                    <div className="w-full h-[70px] flex flex-col items-center justify-start">
                        <div className="w-full flex-1 flex items-start justify-end"><X size={60} strokeWidth={1.6} className="hover:scale-150 transition-transform duration-150"
                            onClick={() => setIsPopup(false)} /></div>
                        <div className="w-full h-0.5 bg-gray-200"></div>
                    </div>

                    {recap ?
                        <div className="flex flex-col items-start overflow-y-scroll overflow-x-hidden px-3 gap-10 py-5">
                            <div>
                                <p className="text-[30px] font-bold">TÓM TẮT:</p>
                                <p className="text-[18px]">{recap.summary}</p>
                            </div>

                            <div>
                                <p className="text-[30px] font-bold">ĐIỂM CHÍNH:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    {recap.key_points.map((k, index) =>
                                        <li className="w-full text-[18px] whitespace-pre-wrap">{k}</li>
                                    )}
                                </ul>
                            </div>

                            <div>
                                <p className="text-[30px] font-bold">QUAN TRỌNG:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    {recap.important_details.map((k, index) =>
                                        <li className="w-full text-[18px] whitespace-pre-wrap">{k}</li>
                                    )}
                                </ul>
                            </div>

                            <div>
                                <p className="text-[30px] font-bold">CẢM XÚC:</p>
                                <p className="text-[18px]">{recap.emotions_detected}</p>

                            </div>

                            <div>
                                <p className="text-[30px] font-bold">GỢI Ý:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    {recap.next_steps.map((k, index) =>
                                        <li className="w-full text-[18px] whitespace-pre-wrap">{k}</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                        : <></>}
                </div>
            </> : <></>}
            <div className="bg-black/30 h-full w-[120px] rounded-2xl flex flex-col items-center justify-between gap-10 p-8">
                <div className="bg-blue-50 h-20 w-20 rounded-full"></div>

                <div className="w-full flex-1 rounded-2xl">
                    <div className="w-full h-auto flex flex-col items-center gap-5 *:flex *:justify-center *:items-center *:text-white">
                        <div className="w-20 h-20 items-center rounded-full outline-white outline-2"><MessageCircleMore size={45} /></div>
                        {user?.role === "Student" ?
                            <>
                                <div onClick={() => navigate("/chatai")} className="w-[50px] h-[50px] group :hover:w-[80px] :hover:h-[80px] transition-all duration-200"><Bot size={30} className="group-hover:scale-150 transition-transform duration-200" /></div>
                                <div onClick={() => navigate("/counsellors")} className="w-[50px] h-[50px] group :hover:w-[80px] :hover:h-[80px] transition-all duration-200"><UserSearch size={30} className="group-hover:scale-150 transition-transform duration-200" /></div>
                            </>
                            : <></>}
                        <div className="w-[50px] h-[50px] group :hover:w-[80px] :hover:h-[80px] transition-all duration-200"><CalendarFold size={30} className="group-hover:scale-150 transition-transform duration-200" /></div>
                    </div>
                </div>

                <div className="hover:scale-130 transition-transform duration-200 hover:border-b-3 border-white" onClick={() => { navigate('/') }}><LogOut size={50} strokeWidth={1.5} className="text-white" /></div>
            </div>


            <div className="h-full flex-1 flex flex-col items-center gap-5 select-none">
                <div className="bg-white w-full h-[75px] rounded-2xl px-3 py-4 flex items-center justify-center gap-2">
                    <Search size={28} className="text-gray-200" />
                    <input className="bg-gray-100 w-full h-full rounded-md text-[15px] px-3" placeholder="Truy tìm đoạn chat."
                        ref={searchArea} value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                            }
                        }}></input>
                </div>

                <div className="bg-white w-full flex-1 rounded-2xl">
                    {filteredConvList.length ? (
                        <div className="flex flex-col gap-2 items-center overflow-y-scroll overflow-x-hidden h-full">
                            {filteredConvList.map((conv, index) =>
                                <div className="w-full flex flex-col justify-start items-center gap-2 p-3"
                                    onClick={() => {
                                        setTargetUser({
                                            user_id: conv.other_user_id,
                                            username: conv.other_username,
                                            email: conv.other_email,
                                            role: conv.other_role,
                                            conversation_id: conv.conversation_id
                                        })
                                        navigate(`/chat/?chat=${conv.other_email}`)
                                    }}
                                    key={index}>

                                    <div className={`w-full flex-1 flex flex-col gap-2 hover:bg-gray-100 cursor-pointer rounded-2xl py-3 px-2 hover:-translate-y-1.5 transition-all duration-150 ${targetFind === conv.other_email ? "bg-gray-200" : "bg-white"}`}>
                                        <div className="w-full flex justify-start gap-2 items-center">
                                            <div className="w-[55px] h-[55px] flex justify-center items-center"><CircleUser size={50} strokeWidth={1.5} className="text-black" /></div>
                                            <div className="flex-1 flex flex-col items-start justify-start gap-1">
                                                <p className="text-left text-[30px] text-black h-[35px]">{conv.other_username}</p>
                                                <p className="text-left text-[15px] text-gray-600 h-5">{conv.other_email}</p>
                                            </div>
                                        </div>
                                        <div className="line-clamp-1 w-full max-h-[30px] text-[18px] text-gray-400 px-2">{conv.last_sender_id === user?.user_id ? "Bạn: " : conv.other_username + ": "} {conv.last_message_content}</div>
                                    </div>
                                    <div className="w-full h-0.5 bg-gray-500"></div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="px-15 w-full h-full text-[22px] text-gray-400 flex flex-col justify-center items-center">
                            <p className="w-full text-center">Không tìm thấy cuộc trò chuyện...</p>
                            <div className="bg-blue-400 text-white rounded-2xl text-[18px] font-medium cursor:pointer text-center w-[150px] h-10 flex justify-center items-center select-none"
                                onClick={() => navigate("/counsellors")}>Tìm kiếm</div>
                        </div>
                    )}
                </div>
            </div>

            {targetUser ? (
                <div className="h-full w-[1200px] rounded-2xl flex flex-col gap-0">
                    <div className="w-full h-[100px] flex flex-col gap-0 justify-center items-center">
                        <div className="w-full flex-1 flex items-center bg-white rounded-t-2xl px-6 gap-3">
                            <div className="w-[90px] h-[90px] flex justify-center items-center"><Heart size={60} strokeWidth={1.2} className="text-pink-700" /></div>
                            <div className="h-full flex-1 flex flex-col items-start gap-0 text-left">
                                <p className="text-[40px] font-medium">{targetUser.username}</p>
                                <p className="text-[20px] font-light">{targetUser.email}</p>
                            </div>
                            {user?.role === "Counsellor" ?
                                <div className="w-[90px] h-[90px] flex justify-center items-center hover:scale-120 transition-transform duration-100"
                                    onClick={async () => {
                                        try {
                                            setIsPopup(true)
                                            const res = await AxiosInstance.get(`/chat/summarize/${targetUser.user_id}`)
                                            setRecap(res.data)
                                        }
                                        catch (e: any) {
                                            console.log(e.response)
                                        }
                                    }}><Info size={60} strokeWidth={1.2} className="text-blue-700" /></div>
                                : <></>}
                        </div>
                    </div>

                    <div className="w-full flex-1 flex flex-col overflow-y-auto overflow-x-hidden gap-5 px-5 py-3 border-5 border-white">
                        {msgList.length ? (
                            msgList.map((msg, index) =>
                                <div key={index} className={`flex text-[15px] text-white items-center w-full ${msg.sender_id === user?.user_id ? "justify-end" : "justify-start"}`}
                                    ref={index === msgList.length - 1 ? lastMsg : null}>
                                    <div className={`text-left max-w-2/3 p-3 rounded-2xl text-[18px] whitespace-pre-wrap ${msg.sender_id === user?.user_id ? "bg-blue-500" : "bg-gray-500"}`}>{msg.content}</div>
                                </div>
                            )
                        ) : (
                            <></>
                        )}
                    </div>

                    <div className="w-full h-[120px] bg-white rounded-b-2xl px-5 py-2">
                        <textarea className="w-full h-full text-[16px] rounded-2xl bg-gray-100 p-3 overflow-hidden"
                            disabled={targetUser && targetUser.conversation_id === "" && msgList.length === 1 ? true : false}
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
                                        setConvList(prev => {
                                            const index = prev.findIndex(c => c.other_user_id == targetUser.user_id);
                                            if (index === -1) return prev
                                            const copy = [...prev];
                                            const conv = copy.splice(index, 1)[0];
                                            conv.last_message_content = messageContent;
                                            conv.last_sender_id = user?.user_id || "";
                                            return [conv, ...copy];
                                        })


                                        socket.emit("client_send_message", {
                                            recipient_id: targetUser.user_id,
                                            recipient_role: targetUser.role,
                                            content: messageContent,
                                            conversation_id: targetUser.conversation_id
                                        })
                                        setMessageContent("")
                                    }
                                    else setMessageContent((prev) => prev + "\n");
                                }
                            }}
                            ref={textArea} value={messageContent}
                            placeholder="Bắt đầu chat ở đây."
                        ></textarea></div>
                </div>
            ) : (
                <div className="w-[1200px]"></div>
            )}

        </div>
    )
}