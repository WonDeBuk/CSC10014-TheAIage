// // Client/src/presentation/components/Messaging/ConversationList.tsx
// import React from "react";
// import { useConversations } from "@/presentation/hooks/useConversations";
// import type { ConversationSummary } from "@/services/messaging";

// type Props = {
//   onSelect?: (conversation: ConversationSummary) => void;
//   selectedId?: string | null;
// };

// const FriendlyDate: React.FC<{ iso?: string }> = ({ iso }) => {
//   if (!iso) return null;
//   try {
//     const d = new Date(iso);
//     return <small>{d.toLocaleString()}</small>;
//   } catch {
//     return <small>{iso}</small>;
//   }
// };

// const ConversationList: React.FC<Props> = ({ onSelect, selectedId }) => {
//   const { conversations, loading, error, refresh } = useConversations();

//   return (
//     <aside style={{ width: 320, borderRight: "1px solid #eee", padding: 12 }}>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: 8,
//         }}
//       >
//         <h4 style={{ margin: 0 }}>Conversations</h4>
//         <button onClick={refresh} title="Refresh">
//           ↻
//         </button>
//       </div>

//       {loading && <div>Loading conversations...</div>}
//       {error && (
//         <div style={{ color: "red" }}>Failed to load ({String(error)})</div>
//       )}

//       {!loading && conversations.length === 0 && (
//         <div>No conversations yet</div>
//       )}

//       <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//         {conversations.map((c) => {
//           const isSelected = c.id === selectedId;
//           return (
//             <div
//               key={c.id}
//               onClick={() => onSelect?.(c)}
//               style={{
//                 cursor: "pointer",
//                 padding: 8,
//                 borderRadius: 8,
//                 background: isSelected ? "#f0f8ff" : undefined,
//                 border: isSelected
//                   ? "1px solid #cfe8ff"
//                   : "1px solid transparent",
//               }}
//               aria-selected={isSelected}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   gap: 8,
//                 }}
//               >
//                 <div style={{ fontWeight: 600 }}>{c.title ?? c.id}</div>
//                 <FriendlyDate iso={c.updatedAt} />
//               </div>
//               <div style={{ color: "#555", marginTop: 4 }}>
//                 {c.preview ?? ""}
//               </div>
//               {typeof c.unread === "number" && c.unread > 0 && (
//                 <div style={{ marginTop: 6 }}>
//                   <span
//                     style={{
//                       background: "#ff4d4f",
//                       color: "#fff",
//                       padding: "2px 6px",
//                       borderRadius: 12,
//                       fontSize: 12,
//                     }}
//                   >
//                     {c.unread} new
//                   </span>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </aside>
//   );
// };

// export default ConversationList;

// Client/src/presentation/components/Messaging/ConversationList.tsx
import React, { useState } from "react";
import { useConversations } from "@/presentation/hooks/useConversations";
import type { ConversationSummary } from "@/services/messaging";

type Props = {
  onSelect?: (conversation: ConversationSummary) => void;
  selectedId?: string | null;
};

const FriendlyDate: React.FC<{ iso?: string }> = ({ iso }) => {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    return <small>{d.toLocaleString()}</small>;
  } catch {
    return <small>{iso}</small>;
  }
};

const ConversationList: React.FC<Props> = ({ onSelect, selectedId }) => {
  const { conversations, loading, error, refresh } = useConversations();
  const [showErrorDetail, setShowErrorDetail] = useState(false);

  // Build friendly debug info if error exists and has details (from our services)
  let errorInfo: any = null;
  if (error) {
    // try to extract response, details or tried list
    errorInfo = {
      message: error.message,
      responseStatus: error?.response?.status ?? null,
      responseData: error?.response?.data ?? null,
      tried: error?.tried ?? error?.details ?? null,
    };
  }

  return (
    <aside style={{ width: 320, borderRight: "1px solid #eee", padding: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <h4 style={{ margin: 0 }}>Conversations</h4>
        <button onClick={refresh} title="Refresh">
          ↻
        </button>
      </div>

      {loading && <div>Loading conversations...</div>}

      {error && (
        <div style={{ color: "red", marginBottom: 8 }}>
          <div>Failed to load ({String(error.message)})</div>
          <button
            onClick={() => setShowErrorDetail((s) => !s)}
            style={{ marginTop: 6 }}
          >
            {showErrorDetail ? "Hide details" : "Show details"}
          </button>
          {showErrorDetail && (
            <pre
              style={{
                marginTop: 8,
                background: "#fff",
                padding: 8,
                borderRadius: 6,
                fontSize: 12,
                maxHeight: 220,
                overflow: "auto",
              }}
            >
              {JSON.stringify(errorInfo, null, 2)}
            </pre>
          )}
          <div style={{ marginTop: 8, fontSize: 13 }}>
            Quick checks:
            <ul style={{ margin: "6px 0 0 18px" }}>
              <li>
                Open Network tab → xem request URL & response body (useful)
              </li>
              <li>Check whether API requires auth (token/cookie)</li>
              <li>
                Common endpoint prefixes tried: /api, /v1, /api/v1, /chat,
                /messages
              </li>
            </ul>
          </div>
        </div>
      )}

      {!loading && conversations.length === 0 && !error && (
        <div>No conversations yet</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {conversations.map((c) => {
          const isSelected = c.id === selectedId;
          return (
            <div
              key={c.id}
              onClick={() => onSelect?.(c)}
              style={{
                cursor: "pointer",
                padding: 8,
                borderRadius: 8,
                background: isSelected ? "#f0f8ff" : undefined,
                border: isSelected
                  ? "1px solid #cfe8ff"
                  : "1px solid transparent",
              }}
              aria-selected={isSelected}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <div style={{ fontWeight: 600 }}>{c.title ?? c.id}</div>
                <FriendlyDate iso={c.updatedAt} />
              </div>
              <div style={{ color: "#555", marginTop: 4 }}>
                {c.preview ?? ""}
              </div>
              {typeof c.unread === "number" && c.unread > 0 && (
                <div style={{ marginTop: 6 }}>
                  <span
                    style={{
                      background: "#ff4d4f",
                      color: "#fff",
                      padding: "2px 6px",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  >
                    {c.unread} new
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default ConversationList;
