import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle, RefreshCcw } from "lucide-react";
import "@/presentation/styles/landing.css";
import AxiosInstance from "@/util/AxiosInstance";

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

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const sum = { EE: 0, DP: 0, PA: 0 };
    questions.forEach((q) => {
      sum[q.scale] += scores[q.id] || 0;
    });
    setTotals(sum);
  }, [scores, questions]);

  const saveResult = async () => {
    const sum = { EE: 0, DP: 0, PA: 0 };
    questions.forEach((q) => {
      sum[q.scale] += scores[q.id] || 0;
    });
    
    // Calculate total simply as sum of components for quick reference, 
    // though MBI is usually interpreted by components.
    // Note: PA is reverse scored in some interpretations, but here we just sum raw values.
    const totalScore = sum.EE + sum.DP + sum.PA;

    try {
      await AxiosInstance.post("/tests/save", {
        test_type: "MBI",
        scores: {
            answers: scores,
            subscores: sum
        },
        total_score: totalScore
      });
      console.log("MBI Result saved successfully");
    } catch (error) {
      console.error("Failed to save MBI result", error);
    }
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setDirection(1);
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      saveResult();
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setDirection(-1);
      setCurrentQIndex((prev) => prev - 1);
    }
  };

  const handleSelect = (val: number) => {
    setScores((prev) => ({ ...prev, [questions[currentQIndex].id]: val }));
  };

  const restartTest = () => {
    setScores({});
    setCurrentQIndex(0);
    setIsFinished(false);
  };

  const progress = ((currentQIndex + 1) / questions.length) * 100;
  const currentQ = questions[currentQIndex];

  return (
    <div className="min-h-screen py-30 px-4 flex justify-center items-center hero-bg bg-gray-100">
      <div className="bg-white w-full max-w-3xl p-8 rounded-2xl shadow-2xl relative overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/test")}
            className="text-gray-500 hover:text-blue-600 font-semibold flex items-center transition"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Danh sách
          </button>
          {!isFinished && (
            <span className="text-gray-400 font-medium text-sm">
              Câu {currentQIndex + 1} / {questions.length}
            </span>
          )}
        </div>

        <h1 className="text-center text-3xl font-extrabold text-orange-700 mb-2">Thang đo MBI</h1>
        <p className="text-center text-gray-500 mb-8 italic text-sm">
          Đánh giá mức độ kiệt sức trong công việc (Burnout)
        </p>

        {/* MAIN CONTENT AREA */}
        {!isFinished ? (
          <div className="relative min-h-[400px]">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full mb-8 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-orange-500 rounded-full"
              />
            </div>

            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={currentQ.id}
                custom={direction}
                initial={{ x: direction > 0 ? 50 : -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? -50 : 50, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full"
              >
                <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 min-h-[80px]">
                  {currentQ.text}
                </h3>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {options.map((opt) => {
                    const isSelected = scores[currentQ.id] === opt.value;
                    return (
                      <label key={opt.value} className={`
                        flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all text-sm
                        hover:shadow-md
                        ${isSelected
                          ? "border-orange-500 bg-orange-50 text-orange-900 font-medium"
                          : "border-gray-100 bg-gray-50 hover:bg-gray-100 text-gray-700"}
                      `}>
                        <input
                          type="radio" name={currentQ.id} value={opt.value} className="hidden"
                          checked={isSelected}
                          onChange={() => handleSelect(opt.value)}
                        />
                        <div className={`
                          w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0
                          ${isSelected ? "border-orange-500" : "border-gray-300"}
                        `}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                        </div>
                        {opt.label}
                      </label>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-end mt-auto pt-4 border-t border-gray-100">
              <button
                onClick={handlePrev}
                disabled={currentQIndex === 0}
                className={`
                  flex items-center px-6 py-3 rounded-xl font-semibold transition
                  ${currentQIndex === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                    : "bg-blue-600 text-black hover:bg-blue-700 hover:shadow-xl"}
                `}
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Trước
              </button>

              <button
                onClick={handleNext}
                disabled={scores[currentQ.id] === undefined}
                className={`
                  flex items-center px-8 py-3 rounded-xl font-bold shadow-lg transition transform active:scale-95
                  ${scores[currentQ.id] === undefined
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                    : "bg-orange-600 text-black hover:bg-orange-700 hover:shadow-xl"}
                `}
              >
                {currentQIndex === questions.length - 1 ? "Hoàn thành" : "Tiếp theo"}
                {currentQIndex !== questions.length - 1 && <ChevronRight className="w-5 h-5 ml-1" />}
              </button>
            </div>
          </div>
        ) : (
          /* RESULTS VIEW */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h3 className="text-orange-900 text-2xl font-bold mb-6">Kết quả Burnout</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <div className="p-6 bg-white rounded-2xl border-l-8 border-red-500 shadow-sm">
                <div className="text-4xl font-extrabold text-red-600 mb-2">{totals.EE}</div>
                <p className="text-sm font-bold text-gray-600">Kiệt sức (EE)</p>
              </div>
              <div className="p-6 bg-white rounded-2xl border-l-8 border-orange-500 shadow-sm">
                <div className="text-4xl font-extrabold text-orange-600 mb-2">{totals.DP}</div>
                <p className="text-sm font-bold text-gray-600">Thờ ơ (DP)</p>
              </div>
              <div className="p-6 bg-white rounded-2xl border-l-8 border-blue-500 shadow-sm">
                <div className="text-4xl font-extrabold text-blue-600 mb-2">{totals.PA}</div>
                <p className="text-sm font-bold text-gray-600">Thành tựu (PA)</p>
              </div>
            </div>

            <p className="mb-10 text-xs text-gray-500 italic text-center max-w-lg mx-auto">
              *Lưu ý: Điểm Kiệt sức (EE) và Thờ ơ (DP) càng cao càng xấu. Điểm Thành tựu (PA) càng thấp càng xấu.
            </p>

            <button
              onClick={restartTest}
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
            >
              <RefreshCcw className="w-5 h-5 mr-2" />
              Làm lại bài test
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}
