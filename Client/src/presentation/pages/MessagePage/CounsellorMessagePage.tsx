// CounsellorMessagingPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { ConversationList } from "@/presentation/components/Messaging";
import ChatWindow from "@/presentation/components/Messaging/ChatWindow";
import SummaryPanel from "@/presentation/components/Messaging/SummaryPanel";
import {
  Conversation,
  Message,
} from "@/presentation/components/Messaging/type";
import {
  fetchConversations,
  fetchMessages,
  postMessage,
} from "@/api/messaging"; // adjust path if needed

// If your project resolves @ to presentation, fine. Otherwise change import path to ../../api/messaging

const mapServerConversationToLocal = (s: any): Conversation => {
  // map server fields to your Conversation shape; adjust if your server uses different keys
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

const CounsellorMessagingPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoadingConversations(true);
    fetchConversations()
      .then((res) => {
        // expected: { conversations: [...] } or [...]
        const list = res?.conversations ?? res ?? [];
        const mapped = Array.isArray(list)
          ? list.map(mapServerConversationToLocal)
          : [];
        if (!mounted) return;
        setConversations(mapped);
        // default select first if none
        if (mapped.length && !currentId) setCurrentId(mapped[0].id);
      })
      .catch((err) => {
        console.error("fetchConversations error", err);
      })
      .finally(() => {
        if (mounted) setLoadingConversations(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // when user selects conversation -> fetch messages (fresh)
  async function handleSelect(id: string) {
    setCurrentId(id);
    // optimistic: mark unread 0
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
    try {
      const res = await fetchMessages(id);
      // expected: { conversation_id, messages }
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
    // optimistic local update
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

    // call API
    try {
      const res = await postMessage(currentId, message.text);
      // server returned created message object -> optional mapping
      // we'll ignore server id for now to keep local type, or you can update mapping here
    } catch (err) {
      console.error("postMessage error", err);
      // Optionally rollback or show error to user
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
