import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { io, Socket } from "socket.io-client";
import AxiosInstance from "@/util/AxiosInstance";

interface user {
    username: string;
    user_id: string;
    email: string;
}

interface message {
    sender_id: string;
    content: string;
}

const ChatBot = () => {
    const { user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);

    const [messageList, setMessageList] = useState<message[]>([])
    const [messageContent, setMessageCotent] = useState("")
    const [conversationId, setConvId] = useState("")

    const textArea = useRef<HTMLTextAreaElement>(null)
    const lastMessage = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (lastMessage.current) {
            lastMessage.current.scrollIntoView()
        }
    }, [messageList])

    useEffect(() => {
        if (!user) return;

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
                sender_id: data.sender_id,
                content: data.content
            }
            setConvId(data.conversation_id)
            setMessageList(prev => [...prev, newMessage])
        });

        newSocket.on("summarized_conversation", (data) => console.log(data))

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    return (
        <div className="w-full h-full fixed flex flex-col">
            <div className="w-full flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
                {messageList.map((msg, index) =>
                    <div key={`msg + ${index}`} ref={index === messageList.length - 1 ? lastMessage : null} className={`flex w-full items-center ${msg.sender_id === user?.user_id ? "justify-end" : "justify-start"}`}>
                        <div className={`m-5 text-justify text-white px-5 py-2 rounded-[20px] text-[15px] max-w-3/5 whitespace-pre-wrap
                        ${msg.sender_id === user?.user_id ? "bg-blue-500" : "bg-gray-500"}`}>
                            {msg.content}
                        </div>
                    </div>
                )}
            </div>
            <div className="w-full h-[100px] py-[25px] px-[10px] flex justify-between items-center gap-4">
                <div className="aspect-square h-full bg-amber-400 rounded-2xl flex justify-center items-center">
                    <input type="file" className="hidden"></input>
                </div>
                <textarea className="w-full h-full bg-white text-black font-black border border-black text-[15px]"
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        const rf = textArea.current
                        if (!rf) return
                        setMessageCotent(e.target.value)
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                        const rf = textArea.current
                        if (!rf) return
                        if (e.key === "Enter") {
                            e.preventDefault()
                            if (!socket) {
                                console.error("Socket not connected");
                                return;
                            }
                            const sent_msg: message = {
                                sender_id: user?.user_id || "",
                                content: messageContent
                            }
                            setMessageList(prev => [...prev, sent_msg])
                            socket.emit("client_send_message", {
                                recipient_role: "AI",
                                conversation_id: conversationId,
                                content: messageContent
                            })
                            setMessageCotent("")
                        }
                    }}
                    ref={textArea} value={messageContent}></textarea>
            </div>
        </div>
    )
}

export default ChatBot