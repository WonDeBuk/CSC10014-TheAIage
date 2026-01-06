from mongoengine import connect, Document, StringField, DateTimeField, DateField, IntField, ReferenceField, ObjectIdField, BooleanField, ListField, EmbeddedDocumentField, EmbeddedDocument, CASCADE
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
from datetime import datetime, timezone, date
from dotenv import load_dotenv
import random
import os

load_dotenv()

MONGO_DB_URL = os.getenv("MONGO_DB_URL")

connect(db="Account", alias="AccountDB", host=MONGO_DB_URL)
connect(db="Chat", alias="ChatDB", host=MONGO_DB_URL)

class UserModel(Document):
    user_id = ObjectIdField(primary_key=True, default=ObjectId)
    username = StringField(required=True)
    email = StringField(required=True, unique=True)
    hashed_password = StringField(required=True)
    role = StringField(choices=["Student", "Counsellor", "AI"], default="Student")
    description = StringField()
    expertise = ListField(StringField())
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))
    meta = {
        "db_alias": "AccountDB",
        "collection": "Users",
        "indexes": [
            "email",
        ]
    }

    @classmethod
    def create_user(cls, username: str, email: str, plain_password: str, role: str, desc : str = "", tags : list[str] | None = None):
        hashed = generate_password_hash(plain_password, method="pbkdf2:sha256", salt_length=16)
        return cls(username=username, email=email, hashed_password=hashed, role=role, description=desc, expertise=tags or [])

    def check_user_password(self, plain_password: str):
        return check_password_hash(self.hashed_password, plain_password)
    

class UserInfo(EmbeddedDocument):
    user_id = StringField(required=False) #not required, empty means the user is an AI
    username = StringField(required=True)
    email = StringField()
    role = StringField(required=True)

class LastMessageInfo(EmbeddedDocument):
    sender_id = StringField(required=False)
    content = StringField(required=True)

class ConversationModel(Document):
    conversation_id = ObjectIdField(primary_key=True, default=ObjectId)
    host = EmbeddedDocumentField(UserInfo, required=True)
    attendee = EmbeddedDocumentField(UserInfo, required=True)
    last_message = EmbeddedDocumentField(LastMessageInfo, required=False)
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = DateTimeField(default=lambda: datetime.now(timezone.utc))
    meta = {
        "db_alias": "ChatDB",
        "collection": "Conversations",
        "indexes": [
            "host",
            "attendee",
            "-updated_at"
        ]
    }

    @classmethod
    def create_ai_conversation(cls, user_id: str):
        user = UserModel.objects(user_id=user_id).first()
        if not user:
            raise ValueError(f"User with ID {user_id} does not exist.")
        return cls(
            host = UserInfo(user_id="TheAIagent", username="TheAIage", role="AI"),
            attendee = UserInfo(user_id=str(user.user_id), username=user.username, role=user.role, email=user.email )
        )
    
    @classmethod
    def create_user_conversation(cls, host_id: str, attendee_id: str):
        host_user = UserModel.objects(user_id=host_id).first()
        attendee_user = UserModel.objects(user_id=attendee_id).first()

        if not host_user or not attendee_user:
            raise ValueError("One or both users do not exist.")

        return cls(
            host = UserInfo(user_id=str(host_user.user_id), username=host_user.username, role=host_user.role, email=host_user.email),
            attendee = UserInfo(user_id=str(attendee_user.user_id), username=attendee_user.username, role=attendee_user.role, email=attendee_user.email)
        )

    def set_last_message(self, sender_id: str,content: str):
        self.last_sender_id = sender_id
        self.last_message = LastMessageInfo(
            sender_id=sender_id,
            content=content
        )
        self.updated_at = datetime.now(timezone.utc)
        self.save()

class MessageModel(Document):
    message_id = ObjectIdField(primary_key=True, default=ObjectId)
    in_conversation_id = ReferenceField("ConversationModel",
                                    required=True,
                                    reverse_delete_rule=CASCADE)
    sender_id = StringField(required=True, default="TheAIagent")
    content = StringField(required=True)
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))
    meta = {
        "db_alias": "ChatDB",
        "collection": "Messages",
        "indexes": [
            "in_conversation_id",
            "-created_at"
        ]
    } 

class DiagnosisModel(Document):
    diagnosis_id = ObjectIdField(primary_key=True, default=ObjectId)
    in_conversation_id = ReferenceField("ConversationModel", reverse_delete_rule=CASCADE, required=True)
    score = IntField(required=True)
    content = StringField(required=True)
    total_guess = StringField(required=True)
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))
    meta = {
        "db_alias": "ChatDB",
        "collection": "Diagnoses",
        "indexes": [
            "in_conversation_id",
            "-created_at"
        ]
    }

class PlantModel(Document):
    plant_id = ObjectIdField(primary_key=True, default=ObjectId)
    user_id = StringField(required=True)
    plant_type = StringField(required=True, choices=["sunflower", "rose", "lilybell", "narcissus", "daisy", ""], default="")
    previous_level = IntField(default=0)
    previous_exp = IntField(default=0)
    previous_max_exp = IntField(default=100)
    level = IntField(default=0, max_value=20)
    exp = IntField(default=0)
    max_exp = IntField(default=100)
    meta =  {
        "db_alias": "AccountDB",
        "collection": "Plants",
        "indexes": [
            "user_id"
        ]
    }

    def receive_exp(self, exp_gain: int):
        if self.level == 20:
            return
        self.exp += exp_gain
        if self.exp >= self.max_exp:
            while (self.exp >= self.max_exp and self.level < 20):
                self.exp -= self.max_exp 
                self.level += 1
                self.max_exp = round(100 + (self.level + 1) * (self.level + 1) * (3 / 8))
            if self.level == 20:
                self.max_exp = 100
                self.exp = 100
        self.save()

    def update_previous(self):
        self.previous_exp = self.exp
        self.previous_max_exp = self.max_exp
        self.previous_level = self.level
        self.save()

    def reset_stat(self):
        self.exp = 0
        self.previous_exp = 0
        self.max_exp = 100
        self.previous_max_exp = 100
        self.level = 1
        self.previous_level = 1
        self.plant_type = ""
        self.save()

    def harvest(self):
        user = UserModel.objects(user_id = self.user_id).first()
        if not user: 
            raise ValueError("User not found in harvesting.")

        #add the plant into the user stats
        
        self.reset_stat()
   



class MoodModel(Document):
    mood_id = ObjectIdField(primary_key=True, default=ObjectId)
    user_id = StringField(required=True)
    day_created = StringField(required=True)
    mood_score = IntField(default=1,min_value=1,max_value=10)
    note = StringField()
    meta = {
        "db_alias": "AccountDB",
        "collection": "Moods",
        "indexes": [
            "user_id",
            "-day_created"
        ]
    }

class ActivityModel(Document):
    activity_id = ObjectIdField(primary_key=True, default=ObjectId)

    user_id = StringField(required=True)

    day_created = StringField(required=True)

    login = IntField(default=1)
    mood = IntField(default=0)
    diary = IntField(default=0)
    pomodoro = IntField(default=0)
    goal = IntField(default=0)

    meta = {
        "db_alias": "AccountDB",
        "collection": "Activities",
        "indexes": [
            "user_id",
            "-day_created",
        ]
    }

class QuestModel(Document):
    quest_id = ObjectIdField(primary_key=True, default=ObjectId)

    user_id = StringField(required=True)
    type = StringField(choices=["pomodoro", "login", "mood", "goal", "diary"], required=True)
    day_created = StringField(required=True)
    exp = IntField(default=25)
    quota = IntField(required=True, default=1)
    claimed = BooleanField(default=False)

    meta = {
        "db_alias": "AccountDB",
        "collection": "Quests",
        "indexes": [
            "user_id",
            "-day_created",
            "claimed"
        ]
    }

    @classmethod
    def create_quest(cls, quest_type: str, user_id: str, day_created: str):
        estimate_quota = 0
        estimate_exp = 0
        can_claim = False
        user_activity = ActivityModel.objects(user_id=user_id,day_created=day_created).first()
        match quest_type:
            case "login":
                estimate_quota = 1
                estimate_exp = 25
                can_claim = user_activity.login > 0
            case "mood":
                estimate_quota = 1
                estimate_exp = 50
                can_claim = user_activity.mood > 0
            case "diary":
                estimate_quota = 1
                estimate_exp = 100
                can_claim = user_activity.diary > 0
            case "pomodoro":
                estimate_quota = random.randint(1, 2)
                estimate_exp = estimate_quota * 125
                can_claim = user_activity.pomodoro >= estimate_quota
            case "goal":
                estimate_quota = random.randint(1, 3)
                estimate_exp = estimate_quota * 200
                can_claim = user_activity.goal >= estimate_quota

        plant = PlantModel.objects(user_id=user_id,plant_type__ne="").first()
        if plant and can_claim:
            plant.receive_exp(estimate_exp)
        return cls(
            type = quest_type,
            user_id = user_id,
            day_created = day_created,
            exp = estimate_exp,
            quota = estimate_quota,
            claimed = can_claim
        )
            
            
class TaskModel(Document):
    task_id = ObjectIdField(primary_key=True, default=ObjectId)

    user_id = StringField(required=True)
    day_created = StringField(required=True)

    title = StringField(required=True)
    desc = StringField()
    difficulty = IntField(min_value=1, max_value=6)
    is_completed = BooleanField(default=False)

    meta = {
        "db_alias": "AccountDB",
        "collection": "Tasks",
        "indexes": [
            "user_id",
            "-day_created",
        ]
    }


class DiaryModel(Document):
    diary_id = ObjectIdField(primary_key=True, default=ObjectId)

    user_id = StringField(required=True)
    day_created = StringField(required=True)
    content = StringField(required=True)

    meta = {
        "db_alias": "AccountDB",
        "collection": "Diaries",
        "indexes": [
            "user_id",
            "-day_created"
        ]
    }

class SummaryModel(Document):
    summary_id = ObjectIdField(primary_key=True, default=ObjectId)
    user_id = StringField(required=True)
    summary = StringField(required=True)
    key_points = ListField(StringField())
    emotions_detected = StringField()
    important_details = ListField(StringField())
    next_steps = ListField(StringField())
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))
    meta = {
        "db_alias": "ChatDB",
        "collection": "Summaries",
        "indexs": [
            "-created_at",
            "user_id"
        ]
    }
