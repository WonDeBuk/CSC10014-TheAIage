import React, { useState, useEffect, use } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "@/presentation/pages/ChatPage/ChatPage.css";
import { useAuth } from "@/app/providers/AuthProvider";
import AxiosInstance from "@/util/AxiosInstance";
import {
  MessageCircleMore,
  Bot,
  Search,
  UserSearch,
  CalendarFold,
  LogOut,
  User,
  FastForward,
  Target,
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import { Headset, CircleUser, Plus, Trash2 } from "lucide-react";

interface message {
  sender_id: string;
  content: string;
}

interface thread {
  created_at: string;
  conversation_id: string;
  last_sender_id: string;
  last_message_content: string;
}

export default function ChatPageAI() {
  const [searchParams] = useSearchParams();
  const [targetFind, setTargetFind] = useState<string | null>(
    searchParams.get("thread")
  );
  const { user } = useAuth();
  const navigate = useNavigate();
  const [msgList, setMsgList] = useState<message[]>([]);
  const [threadList, setthreadList] = useState<thread[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isResponding, setIsResponding] = useState<boolean>(false);

  const [messageContent, setMessageContent] = useState("");
  const textArea = React.useRef<HTMLTextAreaElement>(null);
  const lastMsg = React.useRef<HTMLDivElement>(null);

  async function fetchMessages() {
    try {
      const rep = await AxiosInstance.get(`chat/message/ai/${targetFind}`);
      setMsgList(rep.data);
    } catch (e: any) {
      setTargetFind("");
      navigate("/chatai");
      console.log(e);
    }
  }

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
    setTargetFind(searchParams.get("thread"));

    const newSocket = io("http://localhost:8000", {
      withCredentials: true,
      auth: {
        token: localStorage.getItem("token") || "",
      },
    });

    newSocket.on("connect", () => {
      console.log("Connected to websocket");
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    newSocket.on("client_receive_message", (data) => {
      console.log("received news: ", data, targetFind);
      if (data.conversation_id === targetFind) {
        setMsgList((prev) => [
          ...prev,
          {
            sender_id: "TheAIagent",
            content: data.content,
          },
        ]);
      }

      setthreadList((prev) => {
        const index = prev.findIndex(
          (t) => t.conversation_id === data.conversation_id
        );
        if (index !== -1) {
          const next = [...prev];
          next[index] = {
            ...next[index],
            last_sender_id: "TheAIagent",
            last_message_content: data.content,
          };
          return next;
        }
        return prev;
      });
    });

    newSocket.on("thread_created", (data) => {
      setTargetFind(data.conversation_id);
      setthreadList((prev) => [
        {
          created_at: data.created_at,
          conversation_id: data.conversation_id,
          last_sender_id: "TheAIagent",
          last_message_content: data.content,
        },
        ...prev,
      ]);
      navigate(`/chatai?thread=${data.conversation_id}`);
    });

    const fetchConversations = async () => {
      try {
        const list = await AxiosInstance.get(
          `/chat/conversation/ai/${-new Date().getTimezoneOffset() / 60}`
        );
        setthreadList(list.data);
        console.log(list.data);
      } catch (e: any) {
        console.log(e);
      }
    };

    fetchConversations();
    if (targetFind) fetchMessages();
    setSocket(newSocket);

    return () => {
      if (socket) {
        socket.disconnect();
        socket.removeAllListeners();
      }
    };
  }, []);

  useEffect(() => {
    if (targetFind) fetchMessages();
  }, [targetFind]);

  useEffect(() => {
    if (targetFind) {
      const index = threadList.findIndex(
        (t) => t.conversation_id === targetFind
      );
      if (index !== -1) {
        if (threadList[index].last_sender_id !== "TheAIagent") {
          setIsResponding(true);
        } else setIsResponding(false);
      }
    }

    if (lastMsg) lastMsg.current?.scrollIntoView();
  }, [msgList]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    if (user && user.role === "Counsellor") {
      navigate("/chat");
      return;
    }
  }, [user]);

  return (
    <div className={`hero-bg h-full w-full fixed flex items-center gap-7 p-5`}>
      <div className="bg-black/20 h-full w-[120px] rounded-2xl flex flex-col items-center justify-between gap-10 p-8">
        <div className="bg-blue-50 h-20 w-20 rounded-full"></div>

        newSocket.on("connect_error", (err) => {
            console.error("Connection error:", err);
        });

        newSocket.on("client_receive_message", (data) => {
            if (data.conversation_id === targetFind) {
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
            setTargetFind(data.conversation_id);
            setthreadList((prev) => [{created_at: data.created_at, conversation_id: data.conversation_id, last_sender_id: "TheAIagent", last_message_content: data.content}, ...prev])
            navigate(`/chatai?thread=${data.conversation_id}`);
        });

        const fetchConversations = async () => {
            try {
                const list = await AxiosInstance.get(`/chat/conversation/ai/${-new Date().getTimezoneOffset() / 60}`)
                setthreadList(list.data)
                console.log(list.data)
            }
            catch (e: any) {
                console.log(e)
            }
        }

        fetchConversations()
        if (targetFind) fetchMessages()
        setSocket(newSocket);

        return () => {
            if (socket) {
                socket.disconnect();
                socket.removeAllListeners();
            }
        }
    }, [])

    useEffect(() => {
        if (targetFind) fetchMessages()
    }, [targetFind])

    useEffect(() => {
        if (targetFind) {
            const index = threadList.findIndex(t => t.conversation_id === targetFind)
            if (index !== -1) {
                console.log(threadList[index])
                if (threadList[index].last_sender_id !== "TheAIagent") {
                    setIsResponding(true)
                }
                else setIsResponding(false)
            }
        }
        else console.log("yeah nah, it aint working boy")

        if (lastMsg) lastMsg.current?.scrollIntoView()
    }, [msgList])

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login")
            return
        }        
        if (user && user.role === "Counsellor") {
            navigate("/chat")
            return
        }
    }, [user])

    return (
        <div className={`hero-bg h-full w-full fixed flex items-center gap-7 p-5`}>
            <div className="bg-black/20 h-full w-[120px] rounded-2xl flex flex-col items-center justify-between gap-10 p-8">
                <div className="bg-blue-50 h-20 w-20 rounded-full"></div>

                <div className="w-full flex-1 rounded-2xl">
                    <div className="w-full h-auto flex flex-col items-center gap-5 *:flex *:justify-center *:items-center *:text-white">
                        <div onClick={() => navigate("/chat")} className="w-[50px] h-[50px] group :hover:w-[80px] :hover:h-[80px] transition-all duration-200 "><MessageCircleMore size={30} className="group-hover:scale-150 transition-transform duration-200" /></div>
                        <div className="w-20 h-20 items-center rounded-full outline-white outline-2"><Bot size={45} className="group-hover:scale-150 transition-transform duration-200" /></div>
                        <div onClick={() => navigate("/counsellors")} className="w-[50px] h-[50px] group :hover:w-[80px] :hover:h-[80px] transition-all duration-200"><UserSearch size={30} className="group-hover:scale-150 transition-transform duration-200" /></div>
                        <div className="w-[50px] h-[50px] group :hover:w-[80px] :hover:h-[80px] transition-all duration-200"><CalendarFold size={30} className="group-hover:scale-150 transition-transform duration-200" /></div>
                    </div>
                </div>

                <div className="hover:scale-130 transition-transform duration-200 hover:border-b-3 border-white" onClick={() => { navigate('/') }}><LogOut size={50} strokeWidth={1.5} className="text-white" /></div>
            </div>
            <div className="w-20 h-20 items-center rounded-full outline-white outline-2">
              <Bot
                size={45}
                className="group-hover:scale-150 transition-transform duration-200"
              />
            </div>

            {targetFind ? (
                <div className="h-full w-[1200px] rounded-2xl flex flex-col gap-0">
                    <div className="w-full h-[100px] flex flex-col gap-0 justify-center items-center">
                        <div className="w-full flex-1 flex gap- items-center rounded-t-2xl px-6 gap-3">
                            <div className="w-[90px] h-[90px] flex justify-center items-center"><Headset size={60} strokeWidth={1.0} className="text-pink-700" /></div>
                            <div className="h-full flex items-center gap-0 text-left">
                                <p className="text-[40px] font-light">TheAIage</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex-1 flex flex-col overflow-y-auto overflow-x-hidden gap-5 px-5 py-3 border-t border-black">
                        {msgList.length ? (
                            msgList.map((msg, index) =>
                                <div key={index} className={`flex text-[15px] text-white items-center w-full ${msg.sender_id === user?.user_id ? "justify-end" : "justify-start"}`}
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

                                    setIsResponding(true)
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
        </div>

        <div
          className="hover:scale-130 transition-transform duration-200 hover:border-b-3 border-white"
          onClick={() => {
            navigate("/");
          }}
        >
          <LogOut size={50} strokeWidth={1.5} className="text-white" />
        </div>
      </div>

      <div
        className={`h-full flex-1 flex flex-col items-center gap-5 select-none ${
          !user || isResponding ? "pointer-events-none" : ""
        }`}
      >
        <div className="w-full h-[75px] flex items-center gap-2">
          <div
            className={`h-[75px] w-[75px] rounded-2xl bg-white flex justify-center items-center hover:scale-120 transition-transform duration-200 ${
              !targetFind ? "pointer-events-none opacity-50" : ""
            }`}
            onClick={() => {
              setTargetFind("");
              navigate("/chatai");
            }}
          >
            <Plus size={50} strokeWidth={1} className="text-gray-500"></Plus>
          </div>
          <div
            className={`h-[75px] w-[75px] rounded-2xl bg-white flex justify-center items-center ${
              targetFind
                ? "hover:scale-120 transition-transform duration-200"
                : "opacity-50"
            }`}
          >
            <Trash2
              size={50}
              strokeWidth={1}
              className="text-gray-500"
            ></Trash2>
          </div>
          <div className="bg-white flex-1 h-[75px] rounded-2xl px-3 py-4 flex items-center justify-center gap-2">
            <Search size={32} strokeWidth={1.5} className="text-gray-200" />
            <input
              className="bg-gray-100 w-full h-full rounded-md text-[15px] px-3"
              placeholder="Tìm kiếm đoạn chat."
            ></input>
          </div>
        </div>

        <div className="bg-white w-full flex-1 rounded-2xl">
          {threadList.length ? (
            <div className="flex flex-col gap-2 items-center overflow-y-scroll overflow-x-hidden h-full">
              {threadList.map((thread, index) => (
                <div className="w-full flex flex-col justify-start items-center gap-2 px-3 py-2">
                  <div
                    className={`w-full h-full flex flex-col justify-start items-center gap-1 hover:translate-x-1.5 hover:bg-gray-100 p-3 rounded-md transition-all duration-100 ${
                      targetFind === thread.conversation_id ? "bg-gray-200" : ""
                    }`}
                    onClick={() => {
                      setTargetFind(thread.conversation_id);
                      navigate(`/chatai?thread=${thread.conversation_id}`);
                    }}
                  >
                    <div className="w-full font-md text-[25px]">
                      {thread.created_at}
                    </div>
                    <div className="w-full text-[15px] font-light line-clamp-1">
                      {thread.last_message_content}
                    </div>
                  </div>
                  <div className="w-full h-0.5 bg-gray-500"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-15 w-full h-full text-[22px] text-gray-400 flex flex-col justify-center items-center">
              <p className="text-center w-full">
                Không tìm thấy cuộc trò chuyện...
              </p>
            </div>
          )}
        </div>
      </div>

      {targetFind ? (
        <div className="h-full w-[1200px] rounded-2xl flex flex-col gap-0">
          <div className="w-full h-[100px] flex flex-col gap-0 justify-center items-center">
            <div className="w-full flex-1 flex gap- items-center rounded-t-2xl px-6 gap-3">
              <div className="w-[90px] h-[90px] flex justify-center items-center">
                <Headset
                  size={60}
                  strokeWidth={1.0}
                  className="text-pink-700"
                />
              </div>
              <div className="h-full flex items-center gap-0 text-left">
                <p className="text-[40px] font-light">TheAIage</p>
              </div>
            </div>
          </div>

          <div className="w-full flex-1 flex flex-col overflow-y-auto overflow-x-hidden gap-5 px-5 py-3 border-t border-black">
            {msgList.length ? (
              msgList.map((msg, index) => (
                <div
                  key={index}
                  className={`flex text-[15px] text-white items-center w-full ${
                    msg.sender_id === user?.user_id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                  ref={index === msgList.length - 1 ? lastMsg : null}
                >
                  <div
                    className={`text-left max-w-2/3     p-3 rounded-2xl text-[18px] whitespace-pre-wrap ${
                      msg.sender_id !== "TheAIagent"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            ) : (
              <></>
            )}
          </div>

          <div className="w-full h-[120px] rounded-b-2xl px-5 py-2">
            <textarea
              className="w-full h-full text-[16px] rounded-2xl bg-white p-3 overflow-hidden"
              disabled={isResponding}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setMessageContent(e.target.value);
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                const rf = textArea.current;
                if (!rf) return;
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
                      content: messageContent,
                    };
                    setMsgList((prev) => [...prev, sent_msg]);
                    setthreadList((prev) => {
                      const index = prev.findIndex(
                        (t) => t.conversation_id === targetFind
                      );
                      if (index !== -1) {
                        const next = [...prev];
                        next[index] = {
                          ...next[index],
                          last_sender_id: user?.user_id || "",
                          last_message_content: messageContent,
                        };
                        return next;
                      }
                      return prev;
                    });
                    socket.emit("client_send_message", {
                      recipient_id: "TheAIagent",
                      recipient_role: "AI",
                      content: messageContent,
                      conversation_id: targetFind,
                    });
                    setMessageContent("");
                  } else setMessageContent((prev) => prev + "\n");
                }
              }}
              ref={textArea}
              value={messageContent}
              placeholder="Trò chuyện ở đây."
            ></textarea>
          </div>
        </div>
      ) : (
        <div className="w-[1200px] flex flex-col justify-center items-center gap-1">
          <p className="text-[50px] text-gray-600 w-[800px] text-center font-[650] select-none">
            TheAIage chào bạn.
          </p>
          <p className="text-[30px] text-gray-400 w-[800px] text-center select-none">
            Hôm nay bạn cảm thấy như thế nào?
          </p>
          <div className="relative w-[800px]">
            <textarea
              className="bg-white w-full h-[120px] text-[18px] rounded-lg p-5 resize-none
                            outline-gray-300 focus:outline-blue-400 focus:outline-2"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              onKeyDown={(e) => {
                if (!socket) return;
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();

                  socket.emit("start_new_thread", {
                    content: messageContent,
                    time_offset: -new Date().getTimezoneOffset() / 420,
                  });
                  setMessageContent("");
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
    </div>
  );
}
