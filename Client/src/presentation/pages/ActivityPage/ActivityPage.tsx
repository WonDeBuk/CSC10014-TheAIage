import React, { useState, useEffect, use } from "react";
import '@/presentation/pages/ChatPage/ChatPage.css';
import { useAuth } from "@/app/providers/AuthProvider";
import AxiosInstance from "@/util/AxiosInstance";
import { io, Socket } from "socket.io-client";

export default function ActivityPage() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState("")
    const [socket, setSocket] = useState<Socket | null>(null)

    const [messageContent, setMessageContent] = useState("")
    const textArea = React.useRef<HTMLTextAreaElement>(null);
    const searchArea = React.useRef<HTMLInputElement>(null);

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

        setSocket(newSocket)

        return () => {
            if (socket) {
                socket.disconnect();
                socket.removeAllListeners();
            }
        }
    }, [])

    return (
        <div></div>
    )
}