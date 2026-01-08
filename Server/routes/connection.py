from fastapi import APIRouter
from database import UserModel, ConversationModel
from fastapi import Depends, HTTPException
from util.token import auth_verifier
from typing import Any

connection_router = APIRouter(prefix="/connection", tags=["connection"])

@connection_router.get("/counsellor")
async def get_counsellor_accounts(payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="Unverified user.")

    counsellor_queryset = UserModel.objects(role="Counsellor").limit(21)

    
    counsellor_list = []
    for acc in counsellor_queryset:
        counsellor_list.append({
            "user_id": str(acc.user_id),
            "username": acc.username,
            "email": acc.email,
            "description": acc.description,
            "expertise": acc.expertise,
            "flavor": acc.flavor
        })

    return counsellor_list

@connection_router.get("/student")
async def get_student_accounts(payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="Unverified user.")
    
    student_queryset = UserModel.objects(role="Student")
    student_list = []
    for acc in student_queryset:
        student_list.append({
            "user_id": str(acc.user_id),
            "username": acc.username,
            "email": acc.email
        })

    return student_list

@connection_router.get("/acquaintance")
async def get_acquaintance(payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="Unverified user.")
    
    user_id = payload.get("user_id")
    user = UserModel.objects(user_id=user_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="Request sent from a non-existing user.")

    acquaintance_list = []    
    role = payload.get("role")
    if (role == "Student"):
        interaction = ConversationModel.objects(attendee__user_id=user_id, host__role__ne="AI")
        for interact in interaction:
            acquaintance_list.append({
                "user_id": interact.host.user_id,
                "email": interact.host.email,
                "username": interact.host.username
            })
    else:
        interaction = ConversationModel.objects(host__user_id=user_id)
        for interact in interaction:
            acquaintance_list.append({
                "user_id": interact.attendee.user_id,
                "email": interact.attendee.email,
                "username": interact.attendee.username
            })

    return acquaintance_list
    