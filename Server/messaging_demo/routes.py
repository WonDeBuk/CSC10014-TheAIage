# Server/messaging_demo/routes.py
from flask import Blueprint, jsonify, request, session
from datetime import datetime
import math

messaging_bp = Blueprint("messaging", __name__, url_prefix="/")

# --- demo storage (in-memory) ---
_demo_conversations = [
    {"id": "c1", "title": "Support - Order #123", "last_message": "Thanks!", "avatar": "S", "tags": ["order"], "time": "09:00", "unread": 1},
    {"id": "c2", "title": "KOC - Campaign", "last_message": "Sent sample.", "avatar": "K", "tags": ["koc"], "time": "Yesterday", "unread": 0},
]

_demo_messages = {
    "c1": [
        {"id": f"m{i+1}", "sender": "user" if i%2==0 else "agent", "text": f"Demo message #{i+1}", "ts": datetime.utcnow().isoformat() + "Z"}
        for i in range(12)  # initial 12 messages for c1
    ],
    "c2": [
        {"id": "m1", "sender": "koc", "text": "I received the product", "ts": datetime.utcnow().isoformat() + "Z"}
    ]
}

# OPTIONAL: seed more messages for testing pagination easily
def seed_more(conv_id: str, total: int):
    cur = _demo_messages.setdefault(conv_id, [])
    start = len(cur)
    for i in range(start, total):
        cur.append({
            "id": f"m{i+1}",
            "sender": "user" if i % 2 == 0 else "agent",
            "text": f"Seeded message #{i+1}",
            "ts": datetime.utcnow().isoformat() + "Z"
        })

# if you want many messages for c1, uncomment next line (e.g., 50)
# seed_more("c1", 50)

# --- helpers for pagination ---
def paginate_list(items: list, page: int, page_size: int):
    total_items = len(items)
    if page_size <= 0: page_size = 10
    total_pages = max(1, math.ceil(total_items / page_size))
    # clamp page
    page = max(1, min(page, total_pages))
    start = (page - 1) * page_size
    end = start + page_size
    page_items = items[start:end]
    return {
        "page": page,
        "page_size": page_size,
        "total_items": total_items,
        "total_pages": total_pages,
        "items": page_items
    }

# --- endpoints ---

@messaging_bp.route("/conversations", methods=["GET"])
def get_conversations():
    # optional session to set cookie
    session.setdefault("visited_conversations", 0)
    session["visited_conversations"] = session["visited_conversations"] + 1

    # read pagination params
    try:
        page = int(request.args.get("page", 1))
    except ValueError:
        page = 1
    try:
        page_size = int(request.args.get("page_size", 10))
    except ValueError:
        page_size = 10

    paged = paginate_list(_demo_conversations, page, page_size)
    # return items in field `conversations`
    return jsonify({
        "conversations": paged["items"],
        "page": paged["page"],
        "page_size": paged["page_size"],
        "total_items": paged["total_items"],
        "total_pages": paged["total_pages"]
    })


@messaging_bp.route("/conversations/<conv_id>/messages", methods=["GET"])
def get_messages(conv_id):
    msgs = _demo_messages.get(conv_id, [])

    # pagination query params
    try:
        page = int(request.args.get("page", 1))
    except ValueError:
        page = 1
    try:
        page_size = int(request.args.get("page_size", 20))
    except ValueError:
        page_size = 20

    paged = paginate_list(msgs, page, page_size)
    return jsonify({
        "conversation_id": conv_id,
        "messages": paged["items"],
        "page": paged["page"],
        "page_size": paged["page_size"],
        "total_items": paged["total_items"],
        "total_pages": paged["total_pages"]
    })


@messaging_bp.route("/conversations/<conv_id>/messages", methods=["POST"])
def post_message(conv_id):
    payload = request.get_json(silent=True) or {}
    text = payload.get("text", "")
    if not text:
        return jsonify({"error": "text is required", "received_raw": request.get_data(as_text=True), "payload": payload}), 400
    ts = datetime.utcnow().isoformat() + "Z"
    new_msg = {"id": f"m{len(_demo_messages.get(conv_id, []))+1}", "sender": "user", "text": text, "ts": ts}
    _demo_messages.setdefault(conv_id, []).append(new_msg)

    # update preview/time in conversations list if exists
    for c in _demo_conversations:
        if c["id"] == conv_id:
            c["last_message"] = text
            c["time"] = ts
            c["unread"] = 0

    return jsonify(new_msg), 201
