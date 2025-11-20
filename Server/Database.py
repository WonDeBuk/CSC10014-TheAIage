from pymongo import MongoClient
from mongoengine import connect, Document, StringField, DateTimeField, ReferenceField, ObjectIdField, EmbeddedDocument, EmbeddedDocumentField, CASCADE
from bson.objectid import ObjectId
from datetime import datetime as DateTime, timezone as TimeZone
from werkzeug.security import generate_password_hash as GenerateHashedPassword, check_password_hash as CheckHashedPassword

connect(db="Authentication", alias="AuthenticationDB", host="mongodb+srv://namnhat828_db_user:4LLinINT0@firstcluster.ei2ujfu.mongodb.net/")
connect(db="Chat", alias="ChatDB", host="mongodb+srv://namnhat828_db_user:4LLinINT0@firstcluster.ei2ujfu.mongodb.net/")


# Khởi tạo các Model/Schema có trong MongoDB
class UserModel(Document):
    UserID = ObjectIdField(primary_key=True, default=ObjectId)
    Email = StringField(required=True, unique=True)
    HashedPassword = StringField(required=True)
    Role = StringField(choices=["Student", "Counsellor", "AI"], default="Student")
    CreatedAt = DateTimeField(default=lambda: DateTime.now(TimeZone.utc))
    meta = {
        "db_alias": "AuthenticationDB",
        "collection": "Users"
    }

    @classmethod
    def CreateUser(cls, __Email: str, __PlainPassword: str):
        Hashed = GenerateHashedPassword(__PlainPassword, method="pbkdf2:sha256", salt_length=16)
        return cls(Email=__Email, HashedPassword=Hashed)

    def CheckUserPassword(self, __PlainPassword: str):
        return CheckHashedPassword(self.HashedPassword, __PlainPassword)

class LastMessageModel(EmbeddedDocument):
    SenderID = StringField(required=True)
    Content = StringField(required=True)
    CreatedAt = DateTimeField(default=lambda: DateTime.now(TimeZone.utc))

class MessageModel(Document):
    MessageID = ObjectIdField(primary_key=True, default=ObjectId)
    InConversationID = ReferenceField("ConversationModel",
                                    required=True,
                                    reverse_delete_rule=CASCADE)
    SenderID = StringField(required=True)
    Content = StringField(required=True)
    CreatedAt = DateTimeField(default=lambda: DateTime.now(TimeZone.utc))
    meta = {
        "db_alias": "ChatDB",
        "collection": "Messages",
        "indexes": [
            "InConversationID",
            "-CreatedAt"
        ]
    }

class ConversationModel(Document):
    ConversationID = ObjectIdField(primary_key=True, default=ObjectId)
    CounsellorID = StringField(required=True)
    StudentID = StringField(required=True)
    LastMessage = EmbeddedDocumentField(LastMessageModel)
    CreatedAt = DateTimeField(default=lambda: DateTime.now(TimeZone.utc))
    UpdatedAt = DateTimeField(default=lambda: DateTime.now(TimeZone.utc))
    meta = {
        "db_alias": "ChatDB",
        "collection": "Conversations",
        "indexes": [
            "CounsellorID",
            "StudentID",
            "-UpdatedAt"
        ]
    }

class MessageModel(Document):
    MessageID = ObjectIdField(primary_key=True, default=ObjectId)
    InConversationID = ReferenceField("ConversationModel",
                                    required=True,
                                    reverse_delete_rule=CASCADE)
    SenderID = StringField(required=True)
    Content = StringField(required=True)
    CreatedAt = DateTimeField(default=DateTime.utcnow)
    meta = {
        "db_alias": "ChatDB",
        "collection": "Messages",
        "indexes": [
            "InConversationID",
            "-CreatedAt"
        ]
    }