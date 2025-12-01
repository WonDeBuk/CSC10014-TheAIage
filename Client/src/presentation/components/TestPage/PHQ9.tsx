import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/presentation/styles/landing.css";

// PHQ-9 chỉ đo 1 chỉ số: Trầm cảm
type QuestionScale = "DEP"; 

interface IQuestion {
  id: string;
  text: string;
  scale: QuestionScale;
}

const defaultQuestions: IQuestion[] = [
  { id: 'q1', text: 'Ít hứng thú hoặc không vui vẻ khi làm việc gì', scale: 'DEP' },
  { id: 'q2', text: 'Cảm thấy chán nản, buồn rầu hoặc tuyệt vọng', scale: 'DEP' },
  { id: 'q3', text: 'Khó ngủ, hoặc ngủ không yên giấc, hoặc ngủ quá nhiều', scale: 'DEP' },
  { id: 'q4', text: 'Cảm thấy mệt mỏi hoặc có ít năng lượng', scale: 'DEP' },
  { id: 'q5', text: 'Kém ăn hoặc ăn quá nhiều', scale: 'DEP' },
  { id: 'q6', text: 'Cảm thấy tồi tệ về bản thân, thấy mình là người thất bại', scale: 'DEP' },
  { id: 'q7', text: 'Khó tập trung vào mọi việc, chẳng hạn như khi học', scale: 'DEP' },
  { id: 'q8', text: 'Di chuyển hoặc nói năng quá chậm chạp khiến người khác chú ý', scale: 'DEP' },
  { id: 'q9', text: 'Có ý nghĩ rằng bạn chết đi thì tốt hơn', scale: 'DEP' },
];

// Option của PHQ-9 hơi khác DASS một chút về câu chữ
const options = [
  { value: 0, label: "Không có chút nào" },
  { value: 1, label: "Vài ngày" },
  { value: 2, label: "Hơn một nửa số ngày" },
  { value: 3, label: "Gần như mọi ngày" },
];

export default function TestPHQ9() {
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
          Thang đo PHQ-9
        </h1>
        <p className="text-center text-gray-500 mb-10 italic">
            Trong 2 tuần qua, bạn gặp các vấn đề sau thường xuyên thế nào?</p>

        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <p className="font-semibold text-gray-700">{q.text}</p>
                <span className=" whitespace-nowrap shrink-0 ml-2 px-3 py-1 rounded text-sm font-bold bg-purple-100 text-purple-600">
                  Trầm cảm
                </span>
              </div>

              <div className="grid gap-3">
                {options.map((opt) => (
                  <label key={opt.value} className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition
                    ${scores[q.id] === opt.value ? "border-purple-500 bg-purple-50" : "border-gray-200 bg-white hover:bg-gray-100"}`}>
                    <input
                      type="radio" name={q.id} value={opt.value} className="mr-3 h-5 w-5 accent-purple-600"
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

        <div className="mt-10 bg-purple-50 border border-purple-300 p-6 rounded-lg text-center">
          <h3 className="text-purple-900 text-xl font-semibold mb-2">Kết quả đánh giá</h3>
          <div className="inline-block p-6 bg-white rounded-lg border-l-4 border-purple-500 shadow-sm">
            <div className="text-4xl font-bold text-purple-600 mb-1">{total}</div>
            <p className="text-gray-600 font-medium">Điểm Trầm cảm</p>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            (0-4: Không/Ít, 5-9: Nhẹ, 10-14: Vừa, 15-19: Nặng, 20-27: Rất nặng)
          </p>
        </div>

      </div>
    </div>
  );
}