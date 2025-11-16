// ConversationList.tsx
import React, { useMemo, useState } from "react";
import { Conversation } from "./type";
import ConversationItem from "./ConversationItem";

interface Props {
  conversations: Conversation[];
  currentId?: string | null;
  onSelect: (id: string) => void;
  searchPlaceholder?: string;
}

const ConversationList: React.FC<Props> = ({
  conversations,
  currentId,
  onSelect,
  searchPlaceholder = "Search conversations...",
}) => {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return conversations;
    return conversations.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.preview || "").toLowerCase().includes(term)
    );
  }, [conversations, q]);

  const pinned = filtered.slice(0, 1);
  const recent = filtered.slice(1);

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Messaging</h2>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={searchPlaceholder}
          className="mt-2 w-full text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          aria-label="Search conversations"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        <div>
          <div className="text-xs font-semibold uppercase text-gray-500 px-2 mb-2">
            Pinned
          </div>
          <div className="space-y-2">
            {pinned.map((c) => (
              <ConversationItem
                key={c.id}
                conversation={c}
                active={currentId === c.id}
                onClick={onSelect}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase text-gray-500 px-2 mb-2">
            Recent
          </div>
          <div className="space-y-2">
            {recent.map((c) => (
              <ConversationItem
                key={c.id}
                conversation={c}
                active={currentId === c.id}
                onClick={onSelect}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ConversationList;
