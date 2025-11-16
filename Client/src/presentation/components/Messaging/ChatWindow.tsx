// Client/src/presentation/components/Messaging/ChatWindow.tsx
import React, { useMemo } from "react";
import { useMessages } from "@/presentation/hooks/useConversations";
import type { MessageItem } from "@/services/messaging";

type Props = {
  conversationId?: string | null;
  conversationTitle?: string;
};

const MessageBubble: React.FC<{ m: MessageItem }> = ({ m }) => {
  const isOut = m.dir === "out";
  return (
    <div
      style={{
        alignSelf: isOut ? "flex-end" : "flex-start",
        maxWidth: "78%",
        padding: "8px 10px",
        borderRadius: 12,
        background: isOut ? "#dcf8c6" : "#fff",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.03)",
        marginBottom: 8,
      }}
    >
      <div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
      <div style={{ fontSize: 11, color: "#666", marginTop: 6 }}>
        {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
      </div>
    </div>
  );
};

const ChatWindow: React.FC<Props> = ({ conversationId, conversationTitle }) => {
  const { messages, loading, error, refresh } = useMessages(conversationId);

  const sorted = useMemo(() => {
    // attempt to sort by createdAt asc
    if (!messages) return [];
    return [...messages].sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return ta - tb;
    });
  }, [messages]);

  if (!conversationId) {
    return (
      <main style={{ flex: 1, padding: 16 }}>
        <div style={{ color: "#888" }}>
          Select a conversation to view messages
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        flex: 1,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <header
        style={{
          borderBottom: "1px solid #eee",
          paddingBottom: 8,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0 }}>{conversationTitle ?? conversationId}</h3>
          <div>
            <button onClick={refresh} title="Reload messages">
              ↻
            </button>
          </div>
        </div>
      </header>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          padding: 8,
        }}
      >
        {loading && <div>Loading messages...</div>}
        {error && (
          <div style={{ color: "red" }}>
            Failed to load messages ({String(error)})
          </div>
        )}
        {!loading && sorted.length === 0 && (
          <div style={{ color: "#666" }}>No messages</div>
        )}

        {sorted.map((m) => (
          <MessageBubble key={m.id} m={m} />
        ))}
      </div>

      {/* simple input placeholder (not wired to API send) */}
      <footer
        style={{ borderTop: "1px solid #eee", paddingTop: 8, marginTop: 8 }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder="Message (sending not implemented here)"
            style={{
              flex: 1,
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ddd",
            }}
            disabled
          />
          <button disabled style={{ padding: "8px 12px", borderRadius: 6 }}>
            Send
          </button>
        </div>
      </footer>
    </main>
  );
};

export default ChatWindow;
