// // Client/src/services/messaging.ts
// import AxiosInstance from "@/util/AxiosInstance";

// /**
//  * Các type cơ bản — chỉnh nếu server trả fields khác
//  */
// export type ConversationSummary = {
//   id: string;
//   title?: string;
//   preview?: string;
//   updatedAt?: string;
//   unread?: number;
//   participants?: Array<{ id: string; name?: string }>;
//   tags?: string[];
//   metadata?: Record<string, any>;
// };

// export type MessageItem = {
//   id: string;
//   senderId?: string;
//   dir?: "in" | "out";
//   text: string;
//   createdAt?: string;
//   meta?: any;
// };

// /**
//  * Helper: unwrap response nếu server dùng { data: ... } wrapper
//  */
// function unwrap<T>(res: any): T {
//   if (!res) return res;
//   if (res.data !== undefined && Object.keys(res).length === 2 && res.status !== undefined) {
//     // Axios response: res.data maybe wrapper or actual payload
//     const payload = res.data;
//     // If payload has .data inside, prefer that
//     return (payload && payload.data !== undefined) ? payload.data : payload;
//   }
//   // fallback: assume res is already payload
//   return res;
// }

// /**
//  * GET /conversations
//  * Trả về mảng ConversationSummary
//  */
// export async function getConversations(): Promise<ConversationSummary[]> {
//   const res = await AxiosInstance.get("/conversations");
//   const data = unwrap<any>(res);
//   // If server returns object with conversations field, try map
//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.conversations)) return data.conversations;
//   if (Array.isArray(data?.items)) return data.items;
//   // fallback: try res.data
//   return Array.isArray(res.data) ? res.data : [];
// }

// /**
//  * GET /conversations/:id/messages
//  * Trả về mảng MessageItem
//  */
// export async function getMessages(conversationId: string): Promise<MessageItem[]> {
//   if (!conversationId) return [];
//   const res = await AxiosInstance.get(`/conversations/${conversationId}/messages`);
//   const data = unwrap<any>(res);
//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.messages)) return data.messages;
//   if (Array.isArray(data?.items)) return data.items;
//   return Array.isArray(res.data) ? res.data : [];
// }



import AxiosInstance from "@/util/AxiosInstance";

const PREFIX = "/api"; // cập nhật khi backend finalize

export async function getConversations() {
  const res = await AxiosInstance.get(`${PREFIX}/conversations`);
  return res.data?.data ?? res.data ?? [];
}

export async function getMessages(conversationId: string) {
  const res = await AxiosInstance.get(`${PREFIX}/conversations/${conversationId}/messages`);
  return res.data?.data ?? res.data ?? [];
}
