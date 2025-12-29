from langchain_google_genai import GoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from database import UserModel, MessageModel
from typing import List
from rag.config import GOOGLE_API_KEY

class ConversationSummary(BaseModel):
    summary: str = Field(
        ...,
        description="Tổng quan ngắn gọn về toàn bộ cuộc trò chuyện."
    )
    key_points: List[str] = Field(
        default_factory=list,
        description="Các điểm đầu dòng được sắp xếp theo thứ tự để nắm bắt những ý chính."
    )
    emotions_detected: str = Field(
        "",
        description="Giọng điệu cảm xúc chung của cuộc trò chuyện."
    )
    important_details: List[str] = Field(
        default_factory=list,
        description="Những sự kiện, quyết định, ngày tháng hoặc cam kết quan trọng."
    )
    next_steps: List[str] = Field(
        default_factory=list,
        description="Các hành động được đề xuất hoặc các bước tiếp theo nếu có liên quan."
    )


parser = JsonOutputParser(pydantic_object=ConversationSummary)
format_instructions = parser.get_format_instructions()

llm = GoogleGenerativeAI(
    model="gemini-2.5-flash-lite",
    api_key=GOOGLE_API_KEY,
    temperature=0.2,
    max_output_tokens=512,
)

prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """
Bạn là người tóm tắt cuộc trò chuyện chuyên nghiệp cho một hệ thống hỗ trợ sức khỏe tâm thần cho sinh viên.

Mục tiêu của bạn:
- Viết tóm tắt ngắn gọn, khách quan.
- Xác định các chủ đề, cảm xúc và ưu tiên chính.
- Ghi lại chính xác dòng thời gian và các quyết định.
- Không bịa đặt hoặc suy đoán thông tin không có sẵn.
- Duy trì tính bảo mật, trung lập và ngôn ngữ hỗ trợ.

Đầu ra BẮT BUỘC tuân theo lược đồ JSON được cung cấp.
Không thêm bất kỳ văn bản nào ngoài JSON.
"""
    ),
    (
        "human",
        """
Bạn sẽ tóm tắt cuộc trò chuyện sau đây.

Cuộc trò chuyện:
--------------------
{transcript}
--------------------

{format_instructions}

Chỉ trả về JSON.
"""
    ),
])

chain = prompt | llm | parser

async def summarizer(user_id, conversation_id):
    user = UserModel.objects(user_id=user_id).first()
    if not user:
        raise ValueError(f"{user_id} is not a valid UserID")

    if not conversation_id:
        raise ValueError(f"{conversation_id} is not a valid ConversationID")

    conversation_messages = (
        MessageModel.objects(in_conversation_id=conversation_id)
        .order_by("created_at")
    )

    transcript_text = ""
    for msg in conversation_messages:
        sender = "User" if msg.sender_id != "TheAIagent" else "AI"
        transcript_text += f"{sender}: {msg.content}\n"

    result = await chain.ainvoke({
        "transcript": transcript_text,
        "format_instructions": format_instructions,
    })

    return result
