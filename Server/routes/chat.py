from datetime import datetime, timedelta, timezone
from fastapi import APIRouter
from database import UserModel, ConversationModel, MessageModel, SummaryModel
from fastapi import Depends, HTTPException
from util.token import auth_verifier
from typing import Any
from helper.summarizer import summarizer

chat_router = APIRouter(prefix="/chat", tags=["chat"])

@chat_router.get("/conversation/human")
async def get_conversation_list(payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="Unverified user.")
    
    user_id = payload.get("user_id")
    user = UserModel.objects(user_id=user_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="Request sent from a non-existing user.")

    role = payload.get("role")
    conv_list = []
    if role == "Student":
        conv_queryset = ConversationModel.objects(attendee__user_id=user_id, host__role__ne="AI").order_by("-updated_at")
        for conv in conv_queryset:
            conv_list.append({
                "other_user_id": conv.host.user_id,
                "other_username": conv.host.username,
                "other_email": conv.host.email,
                "other_role": conv.host.role,
                "conversation_id": str(conv.conversation_id),
                "last_sender_id": conv.last_message.sender_id,
                "last_message_content": conv.last_message.content
            })
    else:
        conv_queryset = ConversationModel.objects(host__user_id=user_id).order_by("-updated_at")
        for conv in conv_queryset:
            conv_list.append({
                "other_user_id": conv.attendee.user_id,
                "other_username": conv.attendee.username,
                "other_email": conv.attendee.email,
                "other_role": conv.attendee.role,
                "conversation_id": str(conv.conversation_id),
                "last_sender_id": conv.last_message.sender_id,
                "last_message_content": conv.last_message.content
            })

    return conv_list

@chat_router.get("/conversation/ai/{time_offset}")
async def get_ai_conversation_list(time_offset: int, payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="Unverified user.")
    
    if time_offset > 24 or time_offset < -24:
        raise HTTPException(status_code=400, detail="Time offset must be between -24 and 24 hours.")

    user_id = payload.get("user_id")
    user = UserModel.objects(user_id=user_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="Request sent from a non-existing user.")

    conv_list = []
    conv_queryset = ConversationModel.objects(attendee__user_id=user_id, host__role="AI").order_by("-updated_at")
    for conv in conv_queryset:
        dt = conv.created_at

        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)

        dt = dt.astimezone(timezone(timedelta(hours=time_offset)))
        formatted = dt.strftime("%H:%M %d/%m/%Y")
        conv_list.append({
            "created_at": formatted,
            "conversation_id": str(conv.conversation_id),
            "last_sender_id": conv.last_message.sender_id if conv.last_message else "",
            "last_message_content": conv.last_message.content if conv.last_message else ""
        })

    return conv_list

@chat_router.get("/message/human/{other_email}")
async def get_message_list(other_email: str, payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="Unverified user.")
    user_role = payload.get("role")

    (host_email, attendee_email) = (other_email, payload.get("email")) if user_role == "Student" else (payload.get("email"), other_email)
    conversation = ConversationModel.objects(host__email=host_email, attendee__email=attendee_email).first()
    if not conversation:
        raise HTTPException(status_code=400, detail="Conversation does not exist.")
    
    conversation_id = conversation.conversation_id
    msg_queryset = MessageModel.objects(in_conversation_id=conversation_id).order_by("-created_at").limit(30)
    messages = []
    for msg in msg_queryset:
        messages.append({
            "sender_id": msg.sender_id,
            "content": msg.content
        })

    return messages[::-1]

@chat_router.get("/message/ai/{conversation_id}")
async def get_ai_message_list(conversation_id: str, payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="Unverified user.")
    
    conversation = ConversationModel.objects(conversation_id=conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=400, detail="Conversation does not exist.")
    
    msg_queryset = MessageModel.objects(in_conversation_id=conversation.conversation_id).order_by("-created_at").limit(30)
    messages = []
    for msg in msg_queryset:
        messages.append({
            "sender_id": msg.sender_id,
            "content": msg.content
        })

    return messages[::-1]

@chat_router.get("/summarize/{user_id}")
async def get_summarized_log(user_id: str, payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="Unverified user.")
    
    if not UserModel.objects(user_id=user_id).first():
        print()
        raise HTTPException(status_code=404, detail="User not found.")

    td = datetime.now(timezone.utc)

    cached = SummaryModel.objects(user_id=user_id).order_by("-created_at").first()
    if cached:
        if cached.created_at.tzinfo is None:
            cached.created_at = cached.created_at.replace(tzinfo=timezone.utc)

        if td - cached.created_at <= timedelta(hours=12):
            return {
                "summary": cached.summary,
                "key_points": cached.key_points,
                "emotions_detected": cached.emotions_detected,
                "important_details": cached.important_details,
                "next_steps": cached.next_steps
            }

    conversations = ConversationModel.objects(attendee__user_id=user_id,host__role="AI").first()
    if not conversations:
        raise HTTPException(status_code=404, detail="Conversation not found.")

    result = await summarizer(user_id)
    SummaryModel(
        user_id=user_id,
        summary=result["summary"],
        key_points=result["key_points"],
        emotions_detected=result["emotions_detected"],
        important_details=result["important_details"],
        next_steps=result["next_steps"]
    ).save()
    return result
    
@chat_router.post("/thread/delete")
async def delete_threads(data: dict[str, Any], payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="Not authorized")
    
    conversation_id = data.get("conversation_id")
    thread = ConversationModel.objects(conversation_id=conversation_id).first()
    if not thread:
        raise HTTPException(status_code=404, detail="Thread does not exist")
    
    thread.delete()