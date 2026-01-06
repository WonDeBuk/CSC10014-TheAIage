import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle, RefreshCcw } from "lucide-react";
import "@/presentation/styles/landing.css";

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

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    let sum = 0;
    questions.forEach((q) => {
      sum += scores[q.id] || 0;
    });
    setTotal(sum);
  }, [scores, questions]);

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setDirection(1);
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
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

        <h1 className="text-center text-3xl font-extrabold text-purple-700 mb-2">
          Thang đo PHQ-9
        </h1>
        <p className="text-center text-gray-500 mb-8 italic text-sm">
          Trong 2 tuần qua, bạn gặp các vấn đề sau thường xuyên thế nào?
        </p>

        {/* MAIN CONTENT AREA */}
        {!isFinished ? (
          <div className="relative min-h-[400px]">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full mb-8 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-purple-500 rounded-full"
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
                            ? "border-purple-500 bg-purple-50 text-purple-900 font-medium"
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
                          ${isSelected ? "border-purple-500" : "border-gray-300"}
                        `}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />}
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
                    : "bg-purple-600 text-black hover:bg-purple-700 hover:shadow-xl"}
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
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-600">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Kết quả đánh giá PHQ-9</h2>

            <div className="inline-block p-8 bg-white rounded-2xl border-l-8 border-purple-500 shadow-lg mb-8">
              <div className="text-5xl font-extrabold text-purple-600 mb-2">{total}</div>
              <p className="text-lg font-semibold text-gray-600">Điểm Trầm cảm</p>
            </div>

            <p className="text-sm text-gray-500 mb-10 max-w-md mx-auto">
              (0-4: Không/Ít, 5-9: Nhẹ, 10-14: Vừa, 15-19: Nặng, 20-27: Rất nặng)
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
