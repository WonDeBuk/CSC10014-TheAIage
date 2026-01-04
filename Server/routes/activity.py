from fastapi import APIRouter
from database import QuestModel, ActivityModel, PlantModel
from fastapi import Depends, HTTPException
from util.token import create_token, auth_verifier
from typing import Any
import random

activity_router = APIRouter(prefix="/activity", tags=["activity"])

async def create_quest(date: str, user_id: str):
    login_quest = QuestModel.create_quest("login", user_id, date)
    login_quest.save()

    goal_quest = QuestModel.create_quest("goal", user_id, date)
    goal_quest.save()

    pomodoro_quest = QuestModel.create_quest("pomodoro", user_id, date)
    pomodoro_quest.save()
    roll = random.randint(1, 3)
    if (roll != 2):
        m_q = QuestModel.create_quest("mood", user_id, date)
        m_q.save()
    if (roll != 1):
        d_q = QuestModel.create_quest("diary", user_id, date)
        d_q.save()


@activity_router.get("/stats/{date}")
async def get_stats(date: str, payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="No authorization")

    user_id = payload.get("user_id")
    activity = ActivityModel.objects(user_id=user_id,day_created=date).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return {
        "login": activity.login,
        "pomodoro": activity.pomodoro,
        "goal": activity.goal,
        "mood": activity.mood,
        "diary": activity.diary
    }  

@activity_router.get("/quest/{date}")
async def get_daily_quest(date: str, payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="No authorization")
    
    user_id = payload.get("user_id")

    plant = PlantModel.objects(user_id=user_id,plant_type__ne="").first()
    if not plant:
        raise HTTPException(status_code=400, detail="No plant for quests")

    quest_queryset = QuestModel.objects(user_id=user_id,day_created=date).order_by("exp")
    if not quest_queryset:
        await create_quest(date, user_id)
        quest_queryset = QuestModel.objects(user_id=user_id, day_created=date).order_by("exp")

    quest_list = []
    for q in quest_queryset:
            quest_list.append({
                "type": q.type,
                "quota": q.quota,
                "exp": q.exp,
                "claimed": q.claimed
            })
    return quest_list

@activity_router.post("/match")
async def update_user_stats(data: dict[str, Any], payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="No authorization")
    
    user_id = payload.get("user_id")
    date = data.get("date")
    activity_type = data.get("activity_type")

    activity = ActivityModel.objects(user_id=user_id,day_created=date).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    progress = 1

    match activity_type:
        case "login":
            activity.login = 1
        case "diary":
            activity.diary = 1
        case "mood":
            activity.mood = 1
        case "pomodoro":
            progress += activity.pomodoro
            activity.pomodoro = progress
        case "goal":
            progress += activity.goal
            activity.goal = progress
    activity.save()

    today_quest = QuestModel.objects(user_id=user_id,day_created=date,type=activity_type,claimed=False).first()
    if today_quest and today_quest.quota <= progress:
        plant = PlantModel.objects(user_id=user_id).first()
        plant.receive_exp(today_quest.exp)
        today_quest.claimed = True
        today_quest.save()

@activity_router.get("/garden/create/{date}/{plant_type}")
async def create_plant(plant_type: str, date: str, payload=Depends(auth_verifier)):
    if not payload:
        return HTTPException(status_code=401, detail="Not authorized")
    
    user_id = payload.get("user_id")
    plant = PlantModel.objects(user_id=user_id).first()

    if not plant:
        plant = PlantModel(user_id=user_id)
    
    plant.plant_type = plant_type
    plant.save()
    await create_quest(date, user_id)
    return {
        "quest_flag": True
    }

@activity_router.post("/garden/harvest")
async def harvest_plant(payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="Not authorized")
    
    user_id = payload.get("user_id")
    plant = PlantModel.objects(user_id=user_id,plant_type__ne="").first()

    if not plant:
        raise HTTPException(status_code=404, detail="No plant to harvest")
    
    plant.harvest()

@activity_router.get("/garden/plant")
async def get_plant(payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="Not authorized")
    
    user_id = payload.get("user_id")
    plant = PlantModel.objects(user_id=user_id).first()

    if not plant or plant.plant_type == "":
        raise HTTPException(status_code=404, detail="Plant not in use or exist")
    
    res = {
        "plant_type": plant.plant_type,
        "previous_exp": plant.previous_exp,
        "previous_level": plant.previous_level,
        "previous_max_exp": plant.previous_max_exp,
        "level": plant.level,
        "exp": plant.exp,
        "max_exp": plant.max_exp
    }

    plant.update_previous()
    return res