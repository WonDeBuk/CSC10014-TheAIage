import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle, RefreshCcw } from "lucide-react";
import "@/presentation/styles/landing.css";
import AxiosInstance from "@/util/AxiosInstance";

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
  const [questions] = useState<IDassQuestion[]>(defaultQuestions);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [totals, setTotals] = useState({ D: 0, A: 0, S: 0 });

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [direction, setDirection] = useState(0); // 1 = next, -1 = prev

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

  const saveResult = async () => {
    // Recalculate explicitly to be safe
    const sum = { D: 0, A: 0, S: 0 };
    questions.forEach((q) => {
      const score = scores[q.id] || 0;
      sum[q.scale] += score;
    });
    const finalTotals = {
      D: sum.D * 2,
      A: sum.A * 2,
      S: sum.S * 2,
    };

    try {
      await AxiosInstance.post("/tests/save", {
        test_type: "DASS21",
        scores: {
          answers: scores,
          subscores: finalTotals
        },
        total_score: finalTotals.D + finalTotals.A + finalTotals.S
      });
      console.log("DASS21 Result saved successfully");
    } catch (error) {
      console.error("Failed to save DASS21 result", error);
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
    <div className="min-h-screen py-30 px-4 flex justify-center items-center hero-bg">
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

        <h1 className="text-center text-3xl font-extrabold text-gray-800 mb-2">
          Thang đo DASS-21
        </h1>
        <p className="text-center text-gray-500 mb-8 italic text-sm">
          Đánh giá mức độ Trầm cảm, Lo âu và Căng thẳng trong 7 ngày qua
        </p>

        {/* MAIN CONTENT AREA */}
        {!isFinished ? (
          <div className="relative min-h-[400px]">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full mb-8 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-blue-500 rounded-full"
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
                <div className="grid gap-3 mb-8">
                  {options.map((opt) => {
                    const isSelected = scores[currentQ.id] === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={`
                          flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all
                          hover:shadow-md
                          ${isSelected
                            ? "border-blue-500 bg-blue-50 text-blue-900 font-medium"
                            : "border-gray-100 bg-gray-50 hover:bg-gray-100 text-gray-700"}
                        `}
                      >
                        <input
                          type="radio"
                          name={currentQ.id}
                          value={opt.value}
                          className="hidden" // hide default radio
                          checked={isSelected}
                          onChange={() => handleSelect(opt.value)}
                        />
                        <div className={`
                          w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center
                          ${isSelected ? "border-blue-500" : "border-gray-300"}
                        `}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
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
                    : "bg-blue-600 text-black hover:bg-blue-700 hover:shadow-xl"}
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
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Bạn đã hoàn thành khảo sát!</h2>
            <p className="text-gray-500 mb-10">Dưới đây là kết quả đánh giá sơ bộ của bạn</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <ResultCard
                label="Trầm cảm (D)"
                score={totals.D}
                color="red"
                desc="Mức độ buồn chán, mất hứng thú"
              />
              <ResultCard
                label="Lo âu (A)"
                score={totals.A}
                color="yellow"
                desc="Mức độ lo lắng, bất an"
              />
              <ResultCard
                label="Căng thẳng (S)"
                score={totals.S}
                color="teal"
                desc="Mức độ căng thẳng thần kinh"
              />
            </div>

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

function ResultCard({ label, score, color, desc }: { label: string; score: number; color: string; desc: string }) {
  const getSeverity = (s: number, label: string) => {
    // DASS-21 Severity Ratings (Standard x2 score)
    // D: Normal 0-9, Mild 10-13, Moderate 14-20, Severe 21-27, Extremely Severe 28+
    // A: Normal 0-7, Mild 8-9, Moderate 10-14, Severe 15-19, Extremely Severe 20+
    // S: Normal 0-14, Mild 15-18, Moderate 19-25, Severe 26-33, Extremely Severe 34+
    if (label.includes("Trầm cảm")) {
      if (s >= 28) return "Cực kỳ nặng";
      if (s >= 21) return "Nặng";
      if (s >= 14) return "Vừa";
      if (s >= 10) return "Nhẹ";
      return "Bình thường";
    }
    if (label.includes("Lo âu")) {
      if (s >= 20) return "Cực kỳ nặng";
      if (s >= 15) return "Nặng";
      if (s >= 10) return "Vừa";
      if (s >= 8) return "Nhẹ";
      return "Bình thường";
    }
    if (label.includes("Căng thẳng")) {
      if (s >= 34) return "Cực kỳ nặng";
      if (s >= 26) return "Nặng";
      if (s >= 19) return "Vừa";
      if (s >= 15) return "Nhẹ";
      return "Bình thường";
    }
    return "";
  };

  const severity = getSeverity(score, label);

  const getSeverityColor = (sev: string) => {
    if (sev === "Bình thường") return "text-green-600";
    if (sev === "Nhẹ") return "text-yellow-600";
    if (sev === "Vừa") return "text-orange-600";
    return "text-red-600";
  };

  const borderColor = {
    red: "border-red-500",
    yellow: "border-yellow-500",
    teal: "border-teal-500"
  }[color];

  return (
    <div className={`p-6 bg-white rounded-2xl border-l-8 shadow-sm ${borderColor}`}>
      <div className={`text-4xl font-extrabold mb-1 ${getSeverityColor(severity)}`}>{score}</div>
      <div className={`text-sm font-bold uppercase mb-2 ${getSeverityColor(severity)}`}>{severity}</div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">{label}</h3>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
  );
}
