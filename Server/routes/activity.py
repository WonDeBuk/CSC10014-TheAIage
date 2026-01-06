from fastapi import APIRouter
from database import QuestModel, ActivityModel, PlantModel, TaskModel, DiaryModel
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
    
    plant = PlantModel.objects(user_id=user_id,plant_type__ne="").first()
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
            if plant:
                plant.receive_exp(75)
        case "goal":
            progress += activity.goal
            activity.goal = progress
            if plant:
                plant.receive_exp(125 * data.get("difficulty"))
    activity.save()

    today_quest = QuestModel.objects(user_id=user_id,day_created=date,type=activity_type,claimed=False).first()
    if plant and today_quest and today_quest.quota <= progress:
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
    is_quest = QuestModel.objects(user_id=user_id,day_created=date).first()
    if not is_quest:
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

@activity_router.get("/daily/{date}")
async def get_daily_goal(date: str, payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="Not authorized")
    
    user_id = payload.get("user_id")
    task_queryset = TaskModel.objects(user_id=user_id,day_created=date).order_by("difficulty")

    if not task_queryset:
        raise HTTPException(status_code=404, detail="No today task")
    
    task_list = []
    for t in task_queryset:
        task_list.append({
            "task_id": str(t.task_id),
            "title": t.title,
            "desc": t.desc,
            "difficulty": t.difficulty,
            "is_completed": t.is_completed
        })

    return task_list

@activity_router.post("/task/assign")
async def create_tommorow_goal(data: dict[str, Any], payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="Not authorized")
    
    user_id = payload.get("user_id")
    date = data.get("date")

    new_task = TaskModel(
        day_created=date,
        user_id=user_id,
        title=data.get("title"),
        difficulty=data.get("difficulty"),
        desc=data.get("desc")
    )

    new_task.save()
    return {
        "task_id": str(new_task.task_id)
    }

@activity_router.post("/task/modify")
async def complete_task(data: dict[str, Any], payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="Not authorized")
    
    task_id = data.get("task_id")
    user_id = payload.get("user_id")
    action_type = data.get("action_type")

    task = TaskModel.objects(task_id=task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task does not exist")
    elif task.user_id != user_id:
        raise HTTPException(status_code=401, detail="Not your task")
    
    match action_type:
        case "complete":
            task.is_completed = True
            task.save()
        case "delete":
            task.delete()
    
@activity_router.get("/diary/records")
async def get_diary_record(payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="Not authorized")
    
    user_id = payload.get("user_id")
    print("User requires diary records:", user_id)
    diary_queryset = DiaryModel.objects(user_id=user_id).order_by("day_created")
    if not diary_queryset:
        raise HTTPException(status_code=404, detail="No diary record found")
    
    diary_list = []
    for diary in diary_queryset:
        diary_list.append({
            "date": diary.day_created,
            "content": diary.content
        })

    return diary_list

@activity_router.get("/diary/{date}")
async def get_dated_record(date: str, payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="Not authorized")
    
    user_id = payload.get("user_id")
    diary = DiaryModel.objects(user_id=user_id, day_created=date).first()
    if not diary:
        raise HTTPException(status_code=404, detail="Diary record does not exist")
    
    return {
        "content": diary.content
    }

@activity_router.post("/diary/modify")
async def modify_dated_record(data: dict[str, Any], payload=Depends(auth_verifier)):
    if not payload:
        raise HTTPException(status_code=401, detail="Not authorized")
    
    user_id = payload.get("user_id")
    date = data.get("date")
    action_type = data.get("action_type")

    diary = DiaryModel.objects(user_id=user_id, day_created=date).first()
    if not diary:
        if action_type == "edit":
            DiaryModel(
                user_id=user_id,
                day_created=date,
                content=data.get("content")
            ).save()
        else:
            raise HTTPException(status_code=404, detail="No record to modify")
    else:
        match action_type:
            case "edit":
                diary.content = data.get("content")
                diary.save()
            case "delete":
                diary.delete()