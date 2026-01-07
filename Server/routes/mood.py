from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone, timedelta
from typing import Any, List

from database import MoodLog, UserModel
from util.token import auth_verifier

mood_router = APIRouter(prefix="/mood", tags=["mood"])

@mood_router.post("")
async def create_mood(data: dict[str, Any], payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="Not authenticated.")

    user_id = payload.get("user_id")
    score = data.get("score")
    note = data.get("note", "")

    if score is None or not (1 <= score <= 10):
        raise HTTPException(status_code=400, detail="Score must be between 1 and 10.")

    user = UserModel.objects(user_id=user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    today = datetime.now(timezone.utc).date()

    # Prevent duplicate mood in same day
    existing = MoodLog.objects(user_id=user, day_created=today).first()
    if existing:
        raise HTTPException(status_code=400, detail="Mood already logged for today.")

    mood = MoodLog(
        user_id=user,
        score=score,
        note=note,
        day_created=today
    )
    mood.save()

    return {
        "msg": "Mood saved successfully",
        "mood_id": str(mood.mood_id),
        "score": mood.score,
        "note": mood.note,
        "day_created": mood.day_created
    }

@mood_router.get("/history")
async def get_mood_history(payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="Not authenticated.")

    user_id = payload.get("user_id")
    user = UserModel.objects(user_id=user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    moods = MoodLog.objects(user_id=user).order_by("-day_created")
    # "day_created": m.day_created.isoformat(),
    #         "created_at": m.created_at.isoformat()

    return [
        {
            "mood_id": str(m.mood_id),
            "score": m.score,
            "note": m.note,
        }
        for m in moods
    ]

@mood_router.get("/recent")
async def get_recent_moods(days: int = 7, payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="Not authenticated.")

    if days <= 0 or days > 30:
        raise HTTPException(status_code=400, detail="Days must be between 1 and 30.")

    user_id = payload.get("user_id")
    user = UserModel.objects(user_id=user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    today = datetime.now(timezone.utc).date()
    from_date = today - timedelta(days=days - 1)

    moods = MoodLog.objects(
        user_id=user,
        day_created__gte=from_date,
        day_created__lte=today
    ).order_by("day_created")

    return [
        {
            "day_created": m.day_created.isoformat(),
            "score": m.score,
            "note": m.note
        }
        for m in moods
    ]

@mood_router.put("/{mood_id}")
async def update_mood(mood_id: str, data: dict[str, Any], payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="Not authenticated.")

    user_id = payload.get("user_id")
    mood = MoodLog.objects(mood_id=mood_id).first()

    if not mood or str(mood.user_id.user_id) != user_id:
        raise HTTPException(status_code=404, detail="Mood not found.")

    score = data.get("score")
    note = data.get("note")

    if score is not None:
        if not (1 <= score <= 10):
            raise HTTPException(status_code=400, detail="Score must be between 1 and 10.")
        mood.score = score

    if note is not None:
        mood.note = note

    mood.save()

    return {"msg": "Mood updated successfully"}

@mood_router.delete("/{mood_id}")
async def delete_mood(mood_id: str, payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="Not authenticated.")

    user_id = payload.get("user_id")
    mood = MoodLog.objects(mood_id=mood_id).first()

    if not mood or str(mood.user_id.user_id) != user_id:
        raise HTTPException(status_code=404, detail="Mood not found.")

    mood.delete()
    return {"msg": "Mood deleted successfully"}
