import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/presentation/styles/landing.css";
// TypeScript Types
type QuestionScale = "D" | "A" | "S";

interface IDassQuestion {
  id: string;
  text: string;
  scale: QuestionScale;
}

const defaultQuestions: IDassQuestion[] = [
  { id: 'q1', text: 'Tôi thấy khó thư giãn', scale: 'S' },
  { id: 'q2', text: 'Tôi nhận ra miệng khô', scale: 'A' },
  { id: 'q3', text: 'Tôi không trải nghiệm được bất kỳ cảm xúc tích cực nào', scale: 'D' },
  { id: 'q4', text: 'Tôi gặp khó khăn trong việc thở', scale: 'A' },
  { id: 'q5', text: 'Tôi thấy khó bắt đầu làm việc', scale: 'D' },
  { id: 'q6', text: 'Tôi có xu hướng phản ứng thái quá', scale: 'S' },
  { id: 'q7', text: 'Tôi bị run (ví dụ: tay run)', scale: 'A' },
  { id: 'q8', text: 'Tôi cảm thấy mình tiêu tốn nhiều năng lượng tinh thần', scale: 'S' },
  { id: 'q9', text: 'Tôi lo lắng về những tình huống có thể hoảng sợ', scale: 'A' },
  { id: 'q10', text: 'Tôi cảm thấy mình không có gì để mong đợi', scale: 'D' },
  { id: 'q11', text: 'Tôi thấy mình dễ bị kích động', scale: 'S' },
  { id: 'q12', text: 'Tôi thấy khó thư giãn', scale: 'S' },
  { id: 'q13', text: 'Tôi cảm thấy buồn và chán nản', scale: 'D' },
  { id: 'q14', text: 'Tôi không khoan dung với bất cứ điều gì cản trở công việc', scale: 'S' },
  { id: 'q15', text: 'Tôi cảm thấy gần như hoảng loạn', scale: 'A' },
  { id: 'q16', text: 'Tôi không thể hào hứng với bất cứ điều gì', scale: 'D' },
  { id: 'q17', text: 'Tôi cảm thấy mình không đáng giá làm người', scale: 'D' },
  { id: 'q18', text: 'Tôi cảm thấy mình khá nhạy cảm', scale: 'S' },
  { id: 'q19', text: 'Tôi nhận thấy tim mình đập mạnh mà không cần gắng sức', scale: 'A' },
  { id: 'q20', text: 'Tôi cảm thấy sợ hãi mà không có lý do chính đáng', scale: 'A' },
  { id: 'q21', text: 'Tôi cảm thấy cuộc sống không có ý nghĩa', scale: 'D' },


];

const options = [
  { value: 0, label: "Không đúng với tôi chút nào" },
  { value: 1, label: "Đúng với tôi một phần" },
  { value: 2, label: "Đúng với tôi phần nhiều" },
  { value: 3, label: "Hoàn toàn đúng với tôi" },
];

export default function TestDASS21() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<IDassQuestion[]>(defaultQuestions);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [totals, setTotals] = useState({ D: 0, A: 0, S: 0 });

  // Tính điểm khi có thay đổi
  useEffect(() => {
    const sum = { D: 0, A: 0, S: 0 };

    questions.forEach((q) => {
      const score = scores[q.id] || 0;
      sum[q.scale] += score;
    });

    setTotals({
      D: sum.D * 2,
      A: sum.A * 2,
      S: sum.S * 2,
    });
  }, [scores, questions]);

  
  return (
    <div className="min-h-screen py-30 px-6 flex justify-center hero-bg">
      <div className="bg-white w-full max-w-4xl p-10 rounded-2xl shadow-xl">
      
       <button 
          onClick={() => navigate("/testselection")}
          className="mb-6 text-gray-500 hover:text-blue-600 font-semibold flex items-center transition"
        >
          ← Quay lại danh sách
        </button>

        <h1 className="text-center text-3xl font-bold text-gray-700 mb-2">
          Thang đo DASS-21
        </h1>
        <p className="text-center text-gray-500 mb-10 italic">
          Đánh giá mức độ Trầm cảm, Lo âu và Căng thẳng của bản thân dựa trên cảm xúc trong 7 ngày qua</p>

        {/* Danh sách câu hỏi */}
        <div className="space-y-6">
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-gray-50 p-5 rounded-lg border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <p className="font-semibold text-gray-700">{q.text}</p>

                <span
                  className={`px-3 py-1 rounded text-sm font-bold 
                    ${
                      q.scale === "D"
                        ? "bg-red-100 text-red-600"
                        : q.scale === "A"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-teal-100 text-teal-600"
                    }
                  `}
                >
                  {q.scale === "D"
                    ? "Trầm cảm"
                    : q.scale === "A"
                    ? "Lo âu"
                    : "Căng thẳng"}
                </span>
              </div>

              <div className="grid gap-3">
                {options.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition
                      ${
                        scores[q.id] === opt.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={opt.value}
                      className="mr-3 h-5 w-5"
                      checked={scores[q.id] === opt.value}
                      onChange={() =>
                        setScores((prev) => ({ ...prev, [q.id]: opt.value }))
                      }
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Kết quả */}
        <div className="mt-10 bg-green-50 border border-green-300 p-6 rounded-lg">
          <h3 className="text-green-900 text-xl font-semibold mb-4">
            Kết quả khảo sát
          </h3>

          <div className="grid grid-cols-3 gap-5">
            <div className="p-4 bg-white rounded border-l-4 border-red-500 text-center">
              <div className="text-3xl font-bold">{totals.D}</div>
              <p>Trầm cảm (D)</p>
            </div>

            <div className="p-4 bg-white rounded border-l-4 border-yellow-500 text-center">
              <div className="text-3xl font-bold">{totals.A}</div>
              <p>Lo âu (A)</p>
            </div>

            <div className="p-4 bg-white rounded border-l-4 border-teal-500 text-center">
              <div className="text-3xl font-bold">{totals.S}</div>
              <p>Căng thẳng (S)</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
