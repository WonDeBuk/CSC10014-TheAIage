// MessageBubble.tsx
import React from "react";
import { Message } from "./type";

interface Props {
  message: Message;
}

const MessageBubble: React.FC<Props> = ({ message }) => {
  const incoming = message.dir === "in";
  return (
    <div className={`mb-3 flex ${incoming ? "justify-start" : "justify-end"}`}>
      <div
        className={`rounded-2xl p-3 max-w-[70%] ${
          incoming ? "bg-gray-100" : "bg-white border"
        }`}
      >
        <div className="text-sm text-gray-800 whitespace-pre-wrap">
          {message.text}
        </div>
      </div>
      <div
        className={`text-[11px] text-gray-400 mt-1 ml-2 ${
          incoming ? "text-left" : "text-right"
        }`}
      >
        {message.time}
      </div>
    </div>
  );
};

export default MessageBubble;
