// ChatWindow.tsx
import React, { useEffect, useRef, useState } from "react";
import { Conversation, Message } from "./type";
import Avatar from "./Avatar";
import MessageBubble from "./MessageBubble";
import EmptyState from "./EmptyState";

interface Props {
  conversation: Conversation | null;
  onSend: (message: Message) => void;
}

const ChatWindow: React.FC<Props> = ({ conversation, onSend }) => {
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages.length]);

  function handleSend() {
    const t = text.trim();
    if (!t || !conversation) return;
    const payload: Message = {
      id: Date.now(),
      dir: "out",
      text: t,
      time: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    onSend(payload);
    setText("");
  }

  if (!conversation) return <EmptyState />;

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div>
            <Avatar text={conversation.avatar} size={36} />
          </div>
          <div>
            <div className="font-semibold">{conversation.name}</div>
            <div className="flex gap-2 mt-1 text-xs text-gray-500">
              {conversation.tags?.map((t, i) => (
                <span
                  key={i}
                  className="bg-gray-100 px-2 py-0.5 rounded-full text-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-md hover:bg-gray-50" aria-label="Call">
            📞
          </button>
          <button
            className="p-2 rounded-md hover:bg-gray-50"
            aria-label="Summary"
          >
            ℹ️
          </button>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4 flex flex-col"
        id="messagesArea"
      >
        <div className="flex justify-center my-4">
          <div className="text-xs bg-gray-100 px-4 py-1 rounded-full">
            Hôm nay
          </div>
        </div>

        <div className="flex flex-col">
          {conversation.messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
        </div>

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white">
        <div className="flex items-end gap-3 bg-gray-100 rounded-lg p-2">
          <textarea
            className="flex-1 bg-transparent resize-none outline-none text-sm px-2 py-1 max-h-32"
            rows={1}
            placeholder="Nhập tin nhắn..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            aria-label="Message input"
          />
          <div className="flex gap-2">
            <button
              className="p-2 rounded-md hover:bg-gray-200"
              aria-label="Attach"
            >
              📎
            </button>
            <button
              className="p-2 rounded-md hover:bg-gray-200"
              aria-label="Emoji"
            >
              😊
            </button>
            <button
              onClick={handleSend}
              className="px-3 py-2 rounded-md bg-blue-600 text-white"
              aria-label="Send"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
