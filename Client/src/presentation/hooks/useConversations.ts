// Client/src/hooks/useConversations.ts
import { useEffect, useState, useCallback } from "react";
import { getConversations, getMessages, ConversationSummary, MessageItem } from "@/services/messaging";

/**
 * Hook: tải danh sách conversations
 */
export function useConversations() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cs = await getConversations();
      setConversations(cs);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    conversations,
    loading,
    error,
    refresh: load,
    setConversations,
  };
}

/**
 * Hook: tải messages cho 1 conversation
 */
export function useMessages(conversationId?: string | null) {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const load = useCallback(async (id?: string | null) => {
    if (!id) return setMessages([]);
    setLoading(true);
    setError(null);
    try {
      const ms = await getMessages(id);
      setMessages(ms);
    } catch (e) {
      setError(e);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    load(conversationId);
  }, [conversationId, load]);

  return {
    messages,
    loading,
    error,
    refresh: () => load(conversationId),
    setMessages,
  };
}
