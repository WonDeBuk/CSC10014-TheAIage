from mongoengine import connect, Document, StringField, DateTimeField, DateField, IntField, ReferenceField, ObjectIdField, BooleanField, ListField, EmbeddedDocumentField, EmbeddedDocument, CASCADE
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
from datetime import datetime, timezone, date
from dotenv import load_dotenv
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

class ActivityModel(Document):
    activity_id = ObjectIdField(primary_key=True, default=ObjectId)

    user_id = ReferenceField(
        "UserModel",
        required=True,
        reverse_delete_rule=CASCADE
    )

    sprout_level = IntField(required=True, default=1)
    exp_count = IntField(required=True, default=0)

    login_check = BooleanField(default=False)
    diary_check = BooleanField(default=False)
    mood_check = BooleanField(default=False)

    day_created = StringField(required=True)

    study_session_count = IntField(default=0)
    finished_task_count = IntField(default=0)

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

    user_id = ReferenceField(
        "UserModel",
        required=True,
        reverse_delete_rule=CASCADE       
    )

    login_quota = BooleanField(default=False)
    diary_quota = BooleanField(default=False)
    mood_quota = BooleanField(default=False)

    day_created = StringField(required=True)

    study_session_quota = IntField(default=0)
    finished_task_quota = IntField(default=0)

    meta = {
        "db_alias": "AccountDB",
        "collection": "Quests",
        "indexes": [
            "user_id",
            "-day_created"
        ]
    }


class DiaryModel(Document):
    diary_id = ObjectIdField(primary_key=True, default=ObjectId)

    user_id = ReferenceField(
        "UserModel",
        required=True,
        reverse_delete_rule=CASCADE
    )

    day_created = DateField(default=lambda: datetime.now(timezone.utc).date())

    content = StringField(required=True)

    meta = {
        "db_alias": "AccountDB",
        "collection": "Diaries",
        "indexes": [
            "user_id",
            "-day_created"
        ]
    }

class TaskModel(Document):
    task_id = ObjectIdField(primary_key=True, default=ObjectId)
    time_start = DateTimeField(required=True)
    duration = IntField(require=True)
    activity_name = StringField(required = True)
    description = StringField()
    difficulty = IntField(choices=[0, 1, 2, 3, 4, 5], default=0)
    meta = {
        "db_alias": "AccountDB",
        "collection": "Tasks",
        "indexes": [
            "-time_start"
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
