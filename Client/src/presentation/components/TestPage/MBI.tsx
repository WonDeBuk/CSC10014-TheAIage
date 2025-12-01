import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/presentation/styles/landing.css";

// EE: Emotional Exhaustion (Kiệt sức cảm xúc)
// DP: Depersonalization (Phi cá nhân hóa / Thờ ơ)
// PA: Personal Accomplishment (Thành tựu cá nhân)
type QuestionScale = "EE" | "DP" | "PA";

interface IQuestion {
  id: string;
  text: string;
  scale: QuestionScale;
}

// Đây là phiên bản ngắn gọn (9 câu) thường dùng cho demo
const defaultQuestions: IQuestion[] = [
  { id: 'q1', text: 'Tôi cảm thấy kiệt sức về mặt cảm xúc vì công việc', scale: 'EE' },
  { id: 'q2', text: 'Tôi cảm thấy mệt mỏi khi thức dậy và phải đối mặt với công việc', scale: 'EE' },
  { id: 'q3', text: 'Tôi cảm thấy thất vọng với công việc này', scale: 'EE' },
  
  { id: 'q4', text: 'Tôi cảm thấy mình đối xử với một số người như những đồ vật vô tri', scale: 'DP' },
  { id: 'q5', text: 'Tôi trở nên nhẫn tâm hơn với mọi người kể từ khi làm công việc này', scale: 'DP' },
  { id: 'q6', text: 'Tôi lo rằng công việc này đang làm tôi trở nên chai sạn', scale: 'DP' },

  { id: 'q7', text: 'Tôi giải quyết hiệu quả các vấn đề của người khác', scale: 'PA' },
  { id: 'q8', text: 'Tôi cảm thấy mình đóng góp tích cực cho cuộc sống của người khác', scale: 'PA' },
  { id: 'q9', text: 'Tôi dễ dàng tạo ra bầu không khí thoải mái trong công việc', scale: 'PA' },
];

const options = [
  { value: 0, label: "Không bao giờ" },
  { value: 1, label: "Rất hiếm khi" },
  { value: 2, label: "Thỉnh thoảng" },
  { value: 3, label: "Thường xuyên" },
  { value: 4, label: "Rất thường xuyên" },
  { value: 5, label: "Hàng ngày" },
];

export default function TestMBI() {
  const navigate = useNavigate();
  const [questions] = useState<IQuestion[]>(defaultQuestions);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [totals, setTotals] = useState({ EE: 0, DP: 0, PA: 0 });

  useEffect(() => {
    const sum = { EE: 0, DP: 0, PA: 0 };
    questions.forEach((q) => {
      sum[q.scale] += scores[q.id] || 0;
    });
    setTotals(sum);
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

        <h1 className="text-center text-3xl font-bold text-gray-700 mb-2">Thang đo MBI</h1>
        <p className="text-center text-gray-500 mb-10 italic">
            Đánh giá mức độ kiệt sức trong công việc (Burnout)</p>

        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <p className="font-semibold text-gray-700">{q.text}</p>
                <span className={`whitespace-nowrap shrink-0 ml-2 px-3 py-1 rounded text-sm font-bold
                  ${q.scale === 'EE' ? 'bg-red-100 text-red-600' : q.scale === 'DP' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}
                `}>
                  {q.scale === 'EE' ? 'Kiệt sức' : q.scale === 'DP' ? 'Thờ ơ' : 'Thành tựu'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {options.map((opt) => (
                  <label key={opt.value} className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition text-sm
                    ${scores[q.id] === opt.value ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-white hover:bg-gray-100"}`}>
                    <input
                      type="radio" name={q.id} value={opt.value} className="mr-3 h-4 w-4 accent-orange-600"
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

        {/* Kết quả MBI */}
        <div className="mt-10 bg-orange-50 border border-orange-300 p-6 rounded-lg">
          <h3 className="text-orange-900 text-xl font-semibold mb-4">Kết quả Burnout</h3>
          <div className="grid grid-cols-3 gap-5">
            <div className="p-4 bg-white rounded border-l-4 border-red-500 text-center">
              <div className="text-3xl font-bold text-red-600">{totals.EE}</div>
              <p className="text-sm font-medium text-gray-600">Kiệt sức (EE)</p>
            </div>
            <div className="p-4 bg-white rounded border-l-4 border-orange-500 text-center">
              <div className="text-3xl font-bold text-orange-600">{totals.DP}</div>
              <p className="text-sm font-medium text-gray-600">Thờ ơ (DP)</p>
            </div>
            <div className="p-4 bg-white rounded border-l-4 border-blue-500 text-center">
              <div className="text-3xl font-bold text-blue-600">{totals.PA}</div>
              <p className="text-sm font-medium text-gray-600">Thành tựu (PA)</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 italic text-center">
            *Lưu ý: Điểm Kiệt sức (EE) và Thờ ơ (DP) càng cao càng xấu. Điểm Thành tựu (PA) càng thấp càng xấu.
          </p>
        </div>

      </div>
    </div>
  );
}