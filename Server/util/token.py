from fastapi import Request
from dotenv import load_dotenv
import datetime
import jwt
import os

load_dotenv()

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")

async def auth_verifier(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return None
    token = auth_header.split(" ")[1]
    if not token:
        return None
    
    return await verify_token(token)

async def verify_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            return None
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
    return payload

async def create_token(user_id: str, username: str, email: str, role: str):
    expiration = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=int(os.getenv("JWT_EXPIRATION")))

    payload = {
        "user_id": user_id,
        "username": username,
        "email": email,
        "role": role,
        "exp": expiration
    }

    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return token