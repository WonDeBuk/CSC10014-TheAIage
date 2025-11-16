// ConversationItem.tsx
import React from "react";
import Avatar from "./Avatar";
import { Conversation } from "./type";

interface Props {
  conversation: Conversation;
  active?: boolean;
  onClick: (id: string) => void;
}

const ConversationItem: React.FC<Props> = ({
  conversation,
  active = false,
  onClick,
}) => {
  return (
    <div
      tabIndex={0}
      onClick={() => onClick(conversation.id)}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer relative ${
        active ? "bg-gray-100 border-l-4 border-blue-600" : "hover:bg-gray-50"
      }`}
      role="button"
      aria-pressed={active}
    >
      <div className="flex-shrink-0">
        <Avatar text={conversation.avatar} size={40} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <div
            className={`${
              conversation.unread ? "font-semibold" : "font-medium"
            } text-sm text-gray-800`}
          >
            {conversation.name}
          </div>
          <div className="text-xs text-gray-400">{conversation.time}</div>
        </div>
        <div className="text-xs text-gray-500 truncate">
          {conversation.preview}
        </div>
      </div>
      {conversation.unread ? (
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] px-2 rounded-full font-semibold">
          {conversation.unread}
        </div>
      ) : null}
    </div>
  );
};

export default ConversationItem;
