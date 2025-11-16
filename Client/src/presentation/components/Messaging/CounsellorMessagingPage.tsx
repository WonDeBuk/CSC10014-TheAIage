// CounsellorMessagingPage.tsx
import React, { useMemo, useState } from "react";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import SummaryPanel from "./SummaryPanel";
import { demoConversations } from "./data/demo";
import { Conversation, Message } from "./type";

const CounsellorMessagingPage: React.FC = () => {
  const [conversations, setConversations] =
    useState<Conversation[]>(demoConversations);
  const [currentId, setCurrentId] = useState<string | null>(
    conversations[0]?.id ?? null
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentConversation = useMemo(
    () => conversations.find((c) => c.id === currentId) ?? null,
    [conversations, currentId]
  );

  function handleSelect(id: string) {
    setCurrentId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
    setMobileOpen(false);
  }

  function handleSend(message: Message) {
    if (!currentId) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === currentId
          ? {
              ...c,
              messages: [...c.messages, message],
              preview: message.text,
              time: new Date().toLocaleTimeString(),
            }
          : c
      )
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex relative">
      <div className={`${mobileOpen ? "fixed inset-0 z-40" : ""}`}>
        <div
          className={`${
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } transform transition-transform duration-200`}
        >
          <ConversationList
            conversations={conversations}
            currentId={currentId ?? undefined}
            onSelect={handleSelect}
          />
        </div>
      </div>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      <main className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 mr-2 rounded"
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Open menu"
            >
              ☰
            </button>
            <div className="text-lg font-semibold">Counsellor Messaging</div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col">
            <ChatWindow
              conversation={currentConversation}
              onSend={handleSend}
            />
          </div>

          <SummaryPanel
            student={{
              avatar: currentConversation?.avatar ?? "—",
              name: currentConversation?.name ?? "—",
              details: `${currentConversation?.tags?.join(" • ") ?? "—"}`,
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default CounsellorMessagingPage;
