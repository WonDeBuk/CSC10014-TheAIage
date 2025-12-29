import os
from dotenv import load_dotenv
load_dotenv()

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver

from rag.config import GOOGLE_API_KEY
from rag.embeddings.vector_store import initialize_vector_store, initialize_embeddings
from rag.loaders.pdf_loader import load_pdf_documents
from rag.agent.psychology_agent import PsychologyAgentState, create_retrieve_context_tool, update_diagnosis

from pathlib import Path

embeddings = initialize_embeddings()
vector_store = initialize_vector_store(embeddings=embeddings)
model = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite",api_key=GOOGLE_API_KEY,max_retries=0)

def load_and_index_document() -> None:
    pdf_path = Path("data/documents/DSM-5.pdf")

    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF document not found at path: {pdf_path}")

    if vector_store._collection.count() > 0:
        print("Vector store already has documents. Skipping indexing.")
        return

    try:
        docs = load_pdf_documents(pdf_path)
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200,add_start_index=True)
        all_split = splitter.split_documents(docs)
        vector_store.add_documents(all_split)
    except Exception as e:
        print(f"Error loading and indexing document: {str(e)}")


load_and_index_document()

SYSTEM_PROMPT = """
Bạn là một chuyên gia tâm lý AI chuyên chăm sóc sức khỏe tâm thần.

QUY TẮC BẮT BUỘC:
- Chỉ trả lời bằng văn bản thuần (plain text).
- KHÔNG sử dụng Markdown.
- KHÔNG dùng ký tự đặc biệt cho định dạng như:
  #, *, **, _, `, ``` , >, -, •
- KHÔNG dùng danh sách gạch đầu dòng.
- KHÔNG in đậm, in nghiêng, tiêu đề.
- Xuống dòng chỉ bằng ký tự newline bình thường.

Bước 1: Thu thập thông tin triệu chứng của người dùng.
Bước 2: Khi đủ thông tin, dùng retrieve_context và update_diagnosis.
Bước 3: Đánh giá theo 4 mức độ: kém, trung bình, bình thường, tốt.
"""

checkpointer = InMemorySaver()

retrive_context = create_retrieve_context_tool(vector_store)
tools = [retrive_context, update_diagnosis]
agent = create_agent(
    model=model,
    tools=tools,
    state_schema=PsychologyAgentState,
    system_prompt=SYSTEM_PROMPT,
    checkpointer=checkpointer,
)