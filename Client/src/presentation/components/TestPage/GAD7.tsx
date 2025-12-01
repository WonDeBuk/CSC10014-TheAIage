import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/presentation/styles/landing.css";

type QuestionScale = "ANX"; 

interface IQuestion {
  id: string;
  text: string;
  scale: QuestionScale;
}

const defaultQuestions: IQuestion[] = [
  { id: 'q1', text: 'Cảm thấy lo lắng, bồn chồn hoặc đứng ngồi không yên', scale: 'ANX' },
  { id: 'q2', text: 'Không thể ngừng lo lắng hoặc không kiểm soát được lo lắng', scale: 'ANX' },
  { id: 'q3', text: 'Lo lắng quá nhiều về các vấn đề khác nhau', scale: 'ANX' },
  { id: 'q4', text: 'Gặp khó khăn trong việc thư giãn', scale: 'ANX' },
  { id: 'q5', text: 'Cảm thấy bồn chồn đến mức không thể ngồi yên', scale: 'ANX' },
  { id: 'q6', text: 'Dễ trở nên khó chịu hoặc cáu kỉnh', scale: 'ANX' },
  { id: 'q7', text: 'Cảm thấy sợ hãi như thể có điều gì khủng khiếp sắp xảy ra', scale: 'ANX' },
];

const options = [
  { value: 0, label: "Không có chút nào" },
  { value: 1, label: "Vài ngày" },
  { value: 2, label: "Hơn một nửa số ngày" },
  { value: 3, label: "Gần như mọi ngày" },
];

export default function TestGAD7() {
  const navigate = useNavigate();
  const [questions] = useState<IQuestion[]>(defaultQuestions);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let sum = 0;
    questions.forEach((q) => {
      sum += scores[q.id] || 0;
    });
    setTotal(sum);
  }, [scores, questions]);

  return (
    <div className="min-h-screen py-30 px-6 flex justify-center hero-bg bg-gray-100">
      <div className="bg-white w-full max-w-4xl p-10 rounded-2xl shadow-xl">
        
        <button 
          onClick={() => navigate("/testselection")}
          className="mb-6 text-gray-500 hover:text-blue-600 font-semibold flex items-center transition"
        >
          ← Quay lại danh sách
        </button>

        <h1 className="text-center text-3xl font-bold text-gray-700 mb-2">
          Thang đo GAD-7
        </h1>
        <p className="text-center text-gray-500 mb-10 italic">
            Đánh giá mức độ lo âu chung trong 2 tuần qua</p>

        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <p className="font-semibold text-gray-700">{q.text}</p>
                <span className="whitespace-nowrap shrink-0 ml-2 px-3 py-1 rounded text-sm font-bold bg-teal-100 text-teal-600">
                  Lo âu
                </span>
              </div>

              <div className="grid gap-3">
                {options.map((opt) => (
                  <label key={opt.value} className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition
                    ${scores[q.id] === opt.value ? "border-teal-500 bg-teal-50" : "border-gray-200 bg-white hover:bg-gray-100"}`}>
                    <input
                      type="radio" name={q.id} value={opt.value} className="mr-3 h-5 w-5 accent-teal-600"
                      checked={scores[q.id] === opt.value}
                      onChange={() => setScores((prev) => ({ ...prev, [q.id]: opt.value }))}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-teal-50 border border-teal-300 p-6 rounded-lg text-center">
          <h3 className="text-teal-900 text-xl font-semibold mb-2">Kết quả đánh giá</h3>
          <div className="inline-block p-6 bg-white rounded-lg border-l-4 border-teal-500 shadow-sm">
            <div className="text-4xl font-bold text-teal-600 mb-1">{total}</div>
            <p className="text-gray-600 font-medium">Điểm Lo âu</p>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            (0-4: Bình thường, 5-9: Nhẹ, 10-14: Vừa, 15-21: Nặng)
          </p>
        </div>

      </div>
    </div>
  );
}