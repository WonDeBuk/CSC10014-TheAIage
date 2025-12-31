import uvicorn
import socketio
import re
from datetime import datetime, timezone, timedelta
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import auth_router
from routes.connection import connection_router
from routes.chat import chat_router
from util.token import verify_token
from helper.summarizer import summarizer
from helper.analyzer import estimate_research_time
from database import UserModel, ConversationModel, MessageModel
from chatbot import agent
import tempfile
from langchain_community.document_loaders import PyPDFLoader

AllowedOriginList = [
    "http://localhost:5173",  #Dev Origin
    "https://theaiage.vercel.app"  #Production Origin
]

sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins=AllowedOriginList)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=AllowedOriginList,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(connection_router)
app.include_router(chat_router)

sio_app = socketio.ASGIApp(sio, app)

uid_to_sid = {}

@app.get("/")
async def root():
    return {"message": "Welcome to TheAIAge Server!"}

@app.post("/test_upload")
async def upload_file(file: UploadFile = File(...), deadline: str = Form(...)):
    # Save PDF temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    loader = PyPDFLoader(tmp_path)
    pages = loader.load()  #returns a list of Document objects

    text = "\n\n".join([page.page_content for page in pages]).strip()

    if not text:
        return {"message": "No text detected within the provided file."}

    if len(text.replace("\n", "")) <= 100:
        return {"message": "Too little meaningful information within the provided file."}

    result = await estimate_research_time(text, deadline)
    return result

@sio.event
async def connect(sid, environ, auth):
    token = auth.get("token")
    if not token:
        return False  #Reject the connection if no token is provided   
    try:
        payload = await verify_token(token)

        user_id = payload.get("user_id")
        username = payload.get("username")
        email = payload.get("email")
        role = payload.get("role")

        user = UserModel.objects(user_id=user_id).first()
        if not user or user.username != username or user.email != email or user.role != role:
            print("Client does not exist.")
            return False
        
        uid_to_sid[user_id] = sid
        print("--- NEW USER CONNECTED ---", username)
        await sio.save_session(sid, {"user_id": user_id, "username": username, "email": email, "role": role})
        return True
    except ValueError as e:
        print("Client connection failed.")
        return False  #Reject the connection on token verification failure

@sio.event
async def disconnect(sid):
    #no token checking because connect requires token
    session = await sio.get_session(sid)
    user_id = session["user_id"]
    if user_id in uid_to_sid:
        print ("--- USER DISCONNECTED ---", session["username"])
        del uid_to_sid[user_id]

@sio.event #data includese recipient_id, recipient_role, content, conversation_id (optional)
async def client_send_message(sid, data):
    session = await sio.get_session(sid)
    recipient_role = data.get("recipient_role")
    conversation_id = data.get("conversation_id")
    try:
        user_id = session["user_id"]

        user = UserModel.objects(user_id=user_id).first()
        if not user:
            raise ValueError(f"User with ID {user_id} does not exist.")
        
        conversation = None
        if conversation_id:
            conversation = ConversationModel.objects(conversation_id=conversation_id).first()
        if not conversation:
            if recipient_role == "AI":
                conversation = ConversationModel.create_ai_conversation(user_id)
                conversation.save()
            else:
                recipient_id = data.get("recipient_id")
                (host_id, attendee_id) = (user_id, recipient_id) if session["role"] == "Counsellor" else (recipient_id, user_id)
                conversation = ConversationModel.create_user_conversation(host_id, attendee_id)
                conversation.save()
                await sio.emit("new_conversation", {
                    "other_user_id": recipient_id,
                    "other_username": conversation.host.username if session["role"] == "Student" else conversation.attendee.username,
                    "other_email": conversation.host.email if session["role"] == "Student" else conversation.attendee.email,
                    "other_role": recipient_role, 
                    "conversation_id": str(conversation.conversation_id),
                    "last_sender_id": user_id,
                    "last_message_content": data.get("content")
                }, to=uid_to_sid[user_id])

                if (recipient_id in uid_to_sid):
                    recipient_sid = uid_to_sid[recipient_id]
                    await sio.emit("new_conversation", {
                        "other_user_id": user_id,
                        "other_username": user.username,
                        "other_email": user.email,
                        "other_role": session["role"],
                        "conversation_id": str(conversation.conversation_id),
                        "last_sender_id": user_id,
                        "last_message_content": data.get("content")
                    }, to=recipient_sid)

        conversation.set_last_message(user_id, data.get("content"))
        MessageModel(
            in_conversation_id=str(conversation.conversation_id),
            sender_id=user_id,
            content=data.get("content")
        ).save()
        # Handle AI response if recipient is AI
        if recipient_role == "AI":
            msg_queryset = MessageModel.objects(in_conversation_id=conversation.conversation_id).order_by("-created_at").limit(10)
            msg_list = []
            for msg in msg_queryset:
                msg_list.append(("user" if msg.sender_id == user_id else "assistant", msg.content))

            inputs = {"messages": msg_list[::-1], "user_id": user_id}  # Reverse to maintain chronological order
            ai_msg = ""
            async for event in agent.astream(inputs, {"configurable": {"thread_id": str(conversation.conversation_id), "user_id": user_id}}, stream_mode="values"):
                if "messages" not in event:
                    continue  # skip state-only events
                last_message = event["messages"][-1]
                if last_message.type == "ai":
                    if isinstance(last_message.content, str):
                        ai_msg += last_message.content

            #Remove markdown code blocks
            ai_msg = re.sub(r"```.*?```", "", ai_msg, flags=re.DOTALL)
            ai_msg = re.sub(r"[#*_>`•\-]", "", ai_msg)
            ai_msg = re.sub(r"\n{3,}", "\n\n", ai_msg).strip()
            
            MessageModel(
                in_conversation_id=str(conversation.conversation_id),
                content = ai_msg
            ).save()

            conversation.set_last_message("TheAIagent", ai_msg)
            
            await sio.emit("client_receive_message", {
                "conversation_id": str(conversation.conversation_id),
                "sender_id": "TheAIagent",
                "content": ai_msg
            }, to=sid)

        # Forward message to recipient if not AI
        else:
            recipient_id = data.get("recipient_id")
            recipient_sid = uid_to_sid.get(recipient_id)
            if recipient_sid:
                await sio.emit("client_receive_message", {
                    "sender_id": user_id,
                    "content": data.get("content")
                }, to=recipient_sid)

    except ValueError as e:
        await sio.emit("error", {"error": str(e)}, to=sid)
        print(e)
        return
    
@sio.event
async def start_new_thread(sid, data):
    session = await sio.get_session(sid)
    user_id = session["user_id"]
    content = data.get("content")
    if not user_id:
        await sio.emit("error", {"error": "User not authenticated"}, to=sid)
        return

    conversation = ConversationModel.create_ai_conversation(user_id)
    conversation.save()

    MessageModel(
        in_conversation_id=str(conversation.conversation_id),
        sender_id = user_id,
        content= content
    ).save()

    msg_list = [("user", content)]        
    inputs = {"messages": msg_list, "user_id": user_id}
    ai_msg = ""
    async for event in agent.astream(inputs, {"configurable": {"thread_id": str(conversation.conversation_id), "user_id": user_id}}, stream_mode="values"):
        if "messages" not in event:
            continue  # skip state-only events
        last_message = event["messages"][-1]
        if last_message.type == "ai":
            if isinstance(last_message.content, str):
                ai_msg += last_message.content

    #Remove markdown code blocks
    ai_msg = re.sub(r"```.*?```", "", ai_msg, flags=re.DOTALL)
    ai_msg = re.sub(r"[#*_>`•\-]", "", ai_msg)
    ai_msg = re.sub(r"\n{3,}", "\n\n", ai_msg).strip()

    MessageModel(
        in_conversation_id=str(conversation.conversation_id),
        content = ai_msg
    ).save()

    conversation.set_last_message("TheAIagent", ai_msg)

    iso_dt = conversation.created_at.isoformat()
    dt = datetime.fromisoformat(iso_dt)
    dt = dt.astimezone(timezone(timedelta(hours=data.get("time_offset"))))
    formatted = dt.strftime("%H:%M %d/%m/%Y")

    await sio.emit("thread_created", {
        "conversation_id": str(conversation.conversation_id),
        "content": ai_msg,
        "created_at": formatted
    }, to=sid)

if __name__ == '__main__':
    uvicorn.run(sio_app, host="localhost", port=8000)