# Cách chạy code

## Phía Client

```bash
cd Client
npm install
npm run dev
```

## Lưu ý:
- Khi thử chức năng bên frontend mà cần có user thì nên chạy backend trước
- Muốn chat thử với chat bot thì vào http://localhost:5173/test và cần đăng nhập trước khi chat

## Phía Server

```bash
cd Server
```

### Khởi tạo venv

```
python -m venv venv
venv\Scripts\activate
```

### Tải package

```
pip install -r requirements.txt
```

### Tạo file .env trong folder Server

Tự điền vào các trường còn bị thiếu

```
# Google AI
GOOGLE_API_KEY=...
# MongoDB
MONGO_DB_URL=...
MONGO_DB_DATABASE=mental_health_chatbot

# LangSmith (optional - for tracing)
LANGSMITH_TRACING=true
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
LANGSMITH_API_KEY=...
LANGSMITH_PROJECT=mental-health-rag

# Application
CHROMA_DB_PATH=./data/embeddings/chroma_db
DOCUMENTS_PATH=./data/documents
CHATS_PATH=./data/chats

JWT_SECRET_KEY=temp_secret_key_for_jwt
JWT_ALGORITHM=HS256
JWT_EXPIRATION=24  # in hours
```

### Chạy Server

```bash
python app.py
```