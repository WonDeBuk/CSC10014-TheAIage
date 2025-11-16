// StudentMessagingPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { ConversationList } from "@/presentation/components/Messaging";
import ChatWindow from "@/presentation/components/Messaging/ChatWindow";
import {
  Conversation,
  Message,
} from "@/presentation/components/Messaging/type";
import {
  fetchConversations,
  fetchMessages,
  postMessage,
} from "@/api/messaging"; // adjust path

const mapServerConversationToLocal = (s: any): Conversation => {
  return {
    id: String(s.id ?? s.conversation_id ?? s._id ?? String(Date.now())),
    name: s.name ?? s.title ?? "Unknown",
    avatar: s.avatar ?? (s.name ? s.name[0] : "–"),
    preview: s.preview ?? s.last_message ?? "",
    time: s.time ?? s.updated_at ?? "",
    unread: typeof s.unread === "number" ? s.unread : 0,
    tags: s.tags ?? [],
    messages: Array.isArray(s.messages)
      ? s.messages.map((m: any) => ({
          id:
            typeof m.id === "number"
              ? m.id
              : Date.now() + Math.floor(Math.random() * 1000),
          dir: m.sender === "agent" || m.sender === "in" ? "in" : "out",
          text: m.text ?? m.body ?? "",
          time: m.ts ?? m.time ?? new Date().toLocaleTimeString(),
        }))
      : [],
  };
};

const StudentMessagingPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchConversations()
      .then((res) => {
        const list = res?.conversations ?? res ?? [];
        const mapped = Array.isArray(list)
          ? list.map(mapServerConversationToLocal)
          : [];
        if (!mounted) return;
        setConversations(mapped);
        if (mapped.length && !currentId) setCurrentId(mapped[0].id);
      })
      .catch((err) => {
        console.error("fetchConversations error", err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  async function handleSelect(id: string) {
    setCurrentId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
    try {
      const res = await fetchMessages(id);
      const messagesFromServer = res?.messages ?? [];
      const mappedMsgs = messagesFromServer.map((m: any) => ({
        id:
          typeof m.id === "number"
            ? m.id
            : Date.now() + Math.floor(Math.random() * 1000),
        dir: m.sender === "agent" || m.sender === "in" ? "in" : "out",
        text: m.text ?? m.body ?? "",
        time: m.ts ?? m.time ?? new Date().toLocaleTimeString(),
      }));

      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, messages: mappedMsgs } : c))
      );
    } catch (err) {
      console.error("fetchMessages error", err);
    }
    setMobileOpen(false);
  }

  async function handleSend(message: Message) {
    if (!currentId) return;
    const msgToAppend: Message = {
      ...message,
      id: message.id ?? Date.now(),
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === currentId
          ? {
              ...c,
              messages: [...(c.messages ?? []), msgToAppend],
              preview: message.text,
              time: new Date().toLocaleTimeString(),
            }
          : c
      )
    );
    try {
      await postMessage(currentId, message.text);
    } catch (err) {
      console.error("postMessage error", err);
    }
  }

  const currentConversation = useMemo(
    () => conversations.find((c) => c.id === currentId) ?? null,
    [conversations, currentId]
  );

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
            <div className="text-lg font-semibold">Student Messaging</div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col">
            <ChatWindow
              conversation={currentConversation}
              onSend={handleSend}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentMessagingPage;
