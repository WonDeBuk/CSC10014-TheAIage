from langchain_google_genai import GoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from datetime import datetime
from typing import List
from rag.config import GOOGLE_API_KEY

class WorkLoadAnalysis(BaseModel):
    estimation: str = Field(
        ...,
        description="Thời gian ước lượng cần để học tài liệu (dạng ngắn gọn). Ví dụ: '3 giờ', '1.5 ngày', '45 phút'."
    )
    key_takeaways: List[str] = Field(
        default_factory=list,
        description="Những điểm đáng lưu ý trong quá trình nghiên cứu."
    )
    next_steps: List[str] = Field(
        default_factory=list,
        description="Thời gian nên học mỗi ngày cũng như các bước để học tài liệu hiệu quả. Dùng bullet rõ ràng."
    )


parser = JsonOutputParser(pydantic_object=WorkLoadAnalysis)
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
Bạn là người phân tích cách sử dụng thời gian để nghiên cứu tài liệu hiệu quả.

Mục tiêu của bạn:
- Ước lượng thời gian cần dùng để học tài liệu theo nhịp độ thực tế của con người.
- Xác định các điểm tất yếu giúp việc nghiên cứu dễ dàng hơn.
- Trình bày ngắn gọn, rõ ràng, dễ hiểu.
- Không bịa đặt hoặc suy đoán thông tin không có trong tài liệu.
- Duy trì tính trung lập, bảo mật và ngôn ngữ hỗ trợ.

Đầu ra BẮT BUỘC tuân theo lược đồ JSON được cung cấp.
Không thêm bất kỳ văn bản nào ngoài JSON.
"""
    ),
    (
        "human",
        """
Bạn hãy phân tích tài liệu dưới đây và ước lượng thời gian cần thiết để sinh viên nghiên cứu nó.

Khoảng thời gian học dự kiến bắt đầu từ ngày **{starting_date}**
và cần hoàn thành trước ngày **{deadline}**.

Nếu người dùng có cung cấp mô tả thêm, hãy sử dụng nó làm ngữ cảnh bổ sung.

Mô tả của người dùng:
--------------------
{user_desc}
--------------------

Nội dung tài liệu:
--------------------
{estimate_file}
--------------------

Nếu tài liệu gần như trống rỗng hoặc không có chữ,
chỉ trả về JSON dạng:
{{
  "estimation": "Không thể ước lượng",
  "key_takeaways": [],
  "next_steps": ["Tài liệu không chứa nội dung văn bản để phân tích."]
}}

{format_instructions}

Chỉ trả về JSON.
"""
    ),
])

chain = prompt | llm | parser

async def estimate_research_time(
    estimate_file: str,
    deadline: str,
    user_desc: str = ""
):
    today = datetime.now().strftime("%Y-%m-%d")

    result = await chain.ainvoke({
        "estimate_file": estimate_file,
        "starting_date": today,
        "deadline": deadline,
        "user_desc": user_desc,
        "format_instructions": format_instructions,
    })

    return result
