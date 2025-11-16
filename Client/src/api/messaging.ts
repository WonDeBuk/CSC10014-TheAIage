// Client/src/api/messaging.ts
// Ready-to-paste improved API wrapper for messaging
// - fixes body-consumption bug
// - adds types, unified error handling, optional timeout, and small helper

const BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:5000";
const DEFAULT_TIMEOUT_MS = 15000; // optional request timeout

/* ---------- Types ---------- */
export type ServerConversation = any; // adapt if you have a server contract
export type ServerMessage = any;

export interface Conversation {
  id: string;
  name?: string;
  avatar?: string;
  preview?: string;
  time?: string;
  unread?: number;
  tags?: string[];
  messages?: Message[];
}

export interface Message {
  id: number | string;
  dir: "in" | "out";
  text: string;
  time?: string;
}

/* ---------- Helpers ---------- */

async function parseJSONSafe(res: Response) {
  const txt = await res.text();
  try {
    return JSON.parse(txt);
  } catch {
    // return raw text (could be empty or non-json)
    return txt;
  }
}

class ApiError extends Error {
  public status?: number;
  public body?: any;
  constructor(message: string, status?: number, body?: any) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

/**
 * Low-level fetch helper
 * - uses credentials: include
 * - parses body safely
 * - throws ApiError on non-ok responses
 */
async function doFetch(
  input: RequestInfo,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(input, {
      credentials: "include",
      signal: controller.signal,
      ...init,
    });

    const parsed = await parseJSONSafe(res);

    if (!res.ok) {
      // parsed may be string or object
      throw new ApiError(
        `Request failed: ${res.status} ${res.statusText}`,
        res.status,
        parsed
      );
    }

    return parsed;
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new ApiError("Request timed out", 0, null);
    }
    if (err instanceof ApiError) throw err;
    // network error or other
    throw new ApiError(err?.message ?? "Network error", undefined, null);
  } finally {
    clearTimeout(timer);
  }
}

/* ---------- API functions ---------- */

export async function fetchConversations(): Promise<{ conversations: Conversation[] } | any> {
  const url = `${BASE}/conversations`;
  return doFetch(url, { method: "GET" });
}

export async function fetchMessages(conversationId: string): Promise<{ conversation_id?: string; messages: Message[] } | any> {
  const url = `${BASE}/conversations/${encodeURIComponent(conversationId)}/messages`;
  return doFetch(url, { method: "GET" });
}

export async function postMessage(conversationId: string, text: string): Promise<any> {
  const url = `${BASE}/conversations/${encodeURIComponent(conversationId)}/messages`;
  return doFetch(
    url,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }
  );
}

/* ---------- Optional: small wrapper to convert server shape -> client shape ----------
export function normalizeConversation(s: ServerConversation): Conversation { ... }
export function normalizeMessage(m: ServerMessage): Message { ... }
------------------------------------------------------------------------------------*/

/* Notes:
 - Ensure backend enables CORS with credentials: Flask example:
     from flask_cors import CORS
     CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
 - Frontend must use fetch with credentials: include (done in helper).
 - If your server uses string IDs, keep Message.id as string | number or change types accordingly.
*/
