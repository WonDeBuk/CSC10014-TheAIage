from fastapi import APIRouter, HTTPException, Depends, Header
from database import UserModel, TestResultModel
from pydantic import BaseModel
from typing import Dict, Any, Optional
from util.token import verify_token
import datetime

test_router = APIRouter(prefix="/tests", tags=["Tests"])

class TestResultSchema(BaseModel):
    test_type: str
    scores: Dict[str, Any]
    total_score: int

async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authentication token")
    
    try:
        token = authorization.split(" ")[1]
        payload = await verify_token(token)
        user_id = payload.get("user_id")
        user = UserModel.objects(user_id=user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

@test_router.post("/save")
async def save_test_result(result: TestResultSchema, user: UserModel = Depends(get_current_user)):
    try:
        new_result = TestResultModel(
            user_id=user,
            test_type=result.test_type,
            scores=result.scores,
            total_score=result.total_score
        )
        new_result.save()
        return {"message": "Result saved successfully", "id": str(new_result.result_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@test_router.get("/history")
async def get_test_history(user: UserModel = Depends(get_current_user)):
    try:
        # Get all results for this user, sorted by date (newest first)
        results = TestResultModel.objects(user_id=user).order_by("-created_at")
        
        history = []
        for r in results:
            history.append({
                "id": str(r.result_id),
                "test_type": r.test_type,
                "scores": r.scores,
                "total_score": r.total_score,
                "created_at": r.created_at.isoformat()
            })
            
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
