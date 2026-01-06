import { useNavigate } from "react-router-dom";
import "@/presentation/styles/landing.css";

interface TestInfo {
  id: string;
  path: string; // Thêm trường path để biết cần chuyển hướng đi đâu
  name: string;
  desc: string;
  color: string;
}

const AVAILABLE_TESTS: TestInfo[] = [
  {
    id: "DASS21",
    path: "/test/dass21",
    name: "Thang đo DASS-21",
    desc: "Đánh giá mức độ Trầm cảm, Lo âu và Căng thẳng.",
    color: "border-blue-500 text-blue-600 bg-blue-50"
  },
  {
    id: "PHQ9",
    path: "/test/phq9",
    name: "Thang đo PHQ-9",
    desc: "Sàng lọc chuyên sâu về mức độ Trầm cảm.",
    color: "border-purple-500 text-purple-600 bg-purple-50"
  },
  {
    id: "GAD7",
    path: "/test/gad7",
    name: "Thang đo GAD-7",
    desc: "Sàng lọc chuyên sâu về Rối loạn Lo âu lan tỏa.",
    color: "border-teal-500 text-teal-600 bg-teal-50"
  },
  {
    id: "MBI",
    path: "/test/mbi",
    name: "Thang đo MBI",
    desc: "Đánh giá tình trạng Kiệt sức nghề nghiệp (Burnout).",
    color: "border-orange-500 text-orange-600 bg-orange-50"
  },
];

export default function TestSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-40 px-4 flex justify-center items-start hero-bg bg-gray-100">
      <div className="w-full max-w-4xl">
        <h1 className="text-center text-4xl font-bold text-gray-800 mb-4">
          Kiểm tra Tâm lý
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Vui lòng chọn bài kiểm tra bạn muốn thực hiện hôm nay
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {AVAILABLE_TESTS.map((test) => (
            <div
              key={test.id}
              onClick={() => navigate(test.path)}
              className={`
                cursor-pointer p-6 rounded-2xl border-2 bg-white border-gray-100
                hover:shadow-lg transition-all transform hover:-translate-y-1
              `}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 font-bold text-xl ${test.color}`}>
                {test.id.substring(0, 1)}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{test.name}</h3>
              <p className="text-gray-500 text-sm">{test.desc}</p>
              <div className="mt-4 flex items-center text-sm font-semibold text-gray-400 hover:text-blue-600">
                Bắt đầu ngay &rarr;
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}