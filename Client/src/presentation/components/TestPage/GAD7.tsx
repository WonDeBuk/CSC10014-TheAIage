import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle, RefreshCcw } from "lucide-react";
import "@/presentation/styles/landing.css";
import AxiosInstance from "@/util/AxiosInstance";

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

  const saveResult = async () => {
    let sum = 0;
    questions.forEach((q) => {
      sum += scores[q.id] || 0;
    });

    try {
      await AxiosInstance.post("/tests/save", {
        test_type: "GAD7",
        scores: scores,
        total_score: sum
      });
      console.log("Result saved successfully");
    } catch (error) {
      console.error("Failed to save result", error);
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

        <h1 className="text-center text-3xl font-extrabold text-teal-700 mb-2">
          Thang đo GAD-7
        </h1>
        <p className="text-center text-gray-500 mb-8 italic text-sm">
          Đánh giá mức độ lo âu chung trong 2 tuần qua
        </p>

        {/* MAIN CONTENT AREA */}
        {!isFinished ? (
          <div className="relative min-h-[400px]">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full mb-8 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-teal-500 rounded-full"
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
                            ? "border-teal-500 bg-teal-50 text-teal-900 font-medium"
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
                          ${isSelected ? "border-teal-500" : "border-gray-300"}
                        `}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />}
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
                    : "bg-teal-600 text-black hover:bg-teal-700 hover:shadow-xl"}
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
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Kết quả đánh giá GAD-7</h2>

            <div className={`inline-block p-8 bg-white rounded-2xl border-l-8 shadow-lg mb-8 ${total <= 4 ? "border-green-500" :
                total <= 9 ? "border-yellow-500" :
                  total <= 14 ? "border-orange-500" : "border-red-500"
              }`}>
              <div className={`text-5xl font-extrabold mb-2 ${total <= 4 ? "text-green-600" :
                  total <= 9 ? "text-yellow-600" :
                    total <= 14 ? "text-orange-600" : "text-red-600"
                }`}>{total}</div>
              <p className="text-lg font-semibold text-gray-600">Điểm Lo âu</p>
            </div>

            <div className="max-w-xl mx-auto mb-10 text-left bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-2 text-lg">Đánh giá chi tiết:</h3>
              {total <= 4 && (
                <p className="text-green-700">
                  <span className="font-bold">Bình thường (0-4):</span> Tâm trạng của bạn ổn định. Không có dấu hiệu lo âu đáng kể. Hãy tiếp tục duy trì lối sống tích cực!
                </p>
              )}
              {total >= 5 && total <= 9 && (
                <p className="text-yellow-700">
                  <span className="font-bold">Lo âu nhẹ (5-9):</span> Bạn có một chút lo lắng nhưng vẫn trong tầm kiểm soát. Thư giãn, tập thể dục hoặc thiền có thể giúp ích.
                </p>
              )}
              {total >= 10 && total <= 14 && (
                <p className="text-orange-700">
                  <span className="font-bold">Lo âu vừa (10-14):</span> Mức độ lo lắng này đáng lưu tâm. Bạn nên chia sẻ với bạn bè, người thân hoặc tìm kiếm các biện pháp giảm căng thẳng.
                </p>
              )}
              {total >= 15 && (
                <p className="text-red-700">
                  <span className="font-bold">Lo âu nặng (15-21):</span> Mức độ lo âu cao có thể ảnh hưởng đến cuộc sống. Bạn nên cân nhắc gặp chuyên gia tâm lý để được hỗ trợ tốt nhất.
                </p>
              )}
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
