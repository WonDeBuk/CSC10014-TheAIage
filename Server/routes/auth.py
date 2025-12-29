from fastapi import APIRouter
from database import ConversationModel, UserModel
from fastapi import Depends, HTTPException
from util.token import create_token, auth_verifier
from typing import Any

auth_router = APIRouter(prefix="/auth", tags=["auth"])

@auth_router.post("/register")
async def register(data: dict[str, Any], payload=Depends(auth_verifier)):
    if payload:
        raise HTTPException(status_code=400, detail="Already authenticated.")
    email = data.get("email")

    user = UserModel.objects(email=email).first()
    print(email)
    if user:
        raise HTTPException(status_code=400, detail="Email already in use.")
    
    user = UserModel.create_user(data.get("username"), email, data.get("password"), data.get("role"))
    user.save()
    token = await create_token(str(user.user_id), user.username, user.email, user.role)
    return {"mg": "Account created successfully", "token": token}

@auth_router.post("/login")
async def login(data: dict[str, Any], payload=Depends(auth_verifier)):
    if payload:
        raise HTTPException(status_code=400, detail="Already authenticated.")
    
    email = data.get("email")
    password = data.get("password")

    user = UserModel.objects(email=email).first()
    if (not user) or (not user.check_user_password(password)):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    token = await create_token(str(user.user_id), user.username, user.email, user.role)
    return {"msg": "Login successful", "token": token}

@auth_router.get("/me")
async def get_current_user(payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="Not authenticated.")
    user_id = payload.get("user_id")

    user = UserModel.objects(user_id=user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User does not exist.")
    
    return {
        "user_id": str(user.user_id),
        "username": user.username,
        "email": user.email,
        "role": user.role
    }

@auth_router.get("/info/{email}")
async def get_account_info(email: str, payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="Not authenticated.")
    
    user = UserModel.objects(email=email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User does not exist.")
    
    (host_id, attendee_id) = (payload.get("user_id"), str(user.user_id)) if payload.get("role") == "Counsellor" else (str(user.user_id), payload.get("user_id"))
    conversation = ConversationModel.objects(host__user_id=host_id, attendee__user_id=attendee_id).first()

    return {
        "user_id": str(user.user_id),
        "username": user.username,
        "email": user.email,
        "role": user.role,
        # "description": user.description,
        # "expertise": user.expertise
        "conversation_id": str(conversation.conversation_id) if conversation else ""
    }
