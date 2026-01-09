import { useEffect, useState } from "react";
import AxiosInstance from "@/util/AxiosInstance";
import { Clock } from "lucide-react";

interface TestResult {
    id: string;
    test_type: string;
    total_score: number;
    scores: any;
    created_at: string;
}

export default function StudentTestHistory({ userId }: { userId?: string }) {
    const [history, setHistory] = useState<TestResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {

                const url = userId ? `/tests/history?user_id=${userId}` : "/tests/history";
                const response = await AxiosInstance.get(url);
                setHistory(response.data);
            } catch (error) {
                console.error("Failed to fetch test history", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [userId]);

    const getInterpretation = (type: string, score: number, scores: any) => {
        if (type === "GAD7") {
            if (score >= 15) return <span className="text-red-600 font-bold">Lo âu nặng</span>;
            if (score >= 10) return <span className="text-orange-600 font-bold">Lo âu vừa</span>;
            if (score >= 5) return <span className="text-yellow-600 font-bold">Lo âu nhẹ</span>;
            return <span className="text-green-600 font-bold">Bình thường</span>;
        }
        if (type === "PHQ9") {
            if (score >= 20) return <span className="text-red-800 font-bold">Rất nặng</span>;
            if (score >= 15) return <span className="text-red-600 font-bold">Nặng</span>;
            if (score >= 10) return <span className="text-orange-600 font-bold">Vừa</span>;
            if (score >= 5) return <span className="text-yellow-600 font-bold">Nhẹ</span>;
            return <span className="text-green-600 font-bold">Bình thường</span>;
        }
        if (type === "DASS21") {
            const sub = scores?.subscores || {};
            // Simplified display
            return (
                <div className="text-xs space-y-1">
                    <div>D (Trầm cảm): <span className="font-semibold">{sub.D ?? "?"}</span></div>
                    <div>A (Lo âu): <span className="font-semibold">{sub.A ?? "?"}</span></div>
                    <div>S (Căng thẳng): <span className="font-semibold">{sub.S ?? "?"}</span></div>
                </div>
            );
        }
        if (type === "MBI") {
            const sub = scores?.subscores || {};
            const eeRisk = sub.EE >= 27 ? "Cao" : sub.EE >= 17 ? "TB" : "Thấp";
            const dpRisk = sub.DP >= 13 ? "Cao" : sub.DP >= 7 ? "TB" : "Thấp";
            const paRisk = sub.PA <= 31 ? "Cao" : sub.PA <= 38 ? "TB" : "Thấp";

            return (
                <div className="text-xs grid grid-cols-1 gap-1">
                    <div title="Kiệt sức">Kiệt sức: <span className={eeRisk === "Cao" ? "text-red-600 font-bold" : ""}>{eeRisk}</span></div>
                    <div title="Thờ ơ">Thờ ơ: <span className={dpRisk === "Cao" ? "text-red-600 font-bold" : ""}>{dpRisk}</span></div>
                    <div title="Thành tựu (Nguy cơ)">Thành tựu: <span className={paRisk === "Cao" ? "text-red-600 font-bold" : ""}>{paRisk}</span></div>
                </div>
            )
        }
        return <span className="text-gray-400">---</span>;
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Đang tải lịch sử...</div>;

    if (history.length === 0) {
        return (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có lịch sử</h3>
                <p className="text-gray-500">Bạn chưa thực hiện bài kiểm tra nào.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-3 text-blue-500" />
                Lịch sử kiểm tra
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="pb-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Loại bài test</th>
                            <th className="pb-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Điểm số</th>
                            <th className="pb-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Đánh giá</th>
                            <th className="pb-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Ngày thực hiện</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {history.map((record) => (
                            <tr key={record.id} className="group hover:bg-gray-50 transition-colors">
                                <td className="py-4 font-bold text-gray-800 align-top">{record.test_type}</td>
                                <td className="py-4 align-top">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-bold text-sm">
                                        {record.total_score}
                                    </span>
                                </td>
                                <td className="py-4 align-top">
                                    {getInterpretation(record.test_type, record.total_score, record.scores)}
                                </td>
                                <td className="py-4 text-gray-500 text-sm align-top">
                                    {new Date(record.created_at).toLocaleDateString('vi-VN', {
                                        day: '2-digit', month: '2-digit'
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
