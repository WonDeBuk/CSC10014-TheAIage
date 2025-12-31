import os
from dotenv import load_dotenv
from typing import Tuple

def load_enviroment() -> Tuple[str, str]:
    load_dotenv()

    langsmith_key = os.getenv("LANGSMITH_API_KEY")
    google_key = os.getenv("GOOGLE_API_KEY")

    if not langsmith_key or not google_key:
        raise EnvironmentError("Required environment variables are missing.")
    return langsmith_key, google_key

LANGSMITH_API_KEY, GOOGLE_API_KEY = load_enviroment()