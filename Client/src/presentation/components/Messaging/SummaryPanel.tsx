// SummaryPanel.tsx
import React from "react";
import Avatar from "./Avatar";

interface Props {
  student: {
    avatar: string;
    name: string;
    details?: string;
  } | null;
}

const SummaryPanel: React.FC<Props> = ({ student }) => {
  if (!student) return null;
  return (
    <aside className="w-80 bg-white border-l border-gray-200 p-4 hidden lg:flex flex-col overflow-y-auto">
      <div className="text-center p-4 border rounded-md">
        <div className="mx-auto w-16 h-16 mb-3">
          <Avatar text={student.avatar} size={64} />
        </div>
        <div className="font-semibold">{student.name}</div>
        <div className="text-sm text-gray-500">{student.details}</div>
        <div className="mt-3">
          <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold">
            Low Risk
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div className="border rounded-md p-3">
          <div className="text-sm font-semibold mb-1">Quick Summary</div>
          <div className="text-xs text-gray-500">
            Học sinh tích cực, thường xuyên tham gia các hoạt động học tập. Cần
            hỗ trợ thêm về môn Toán.
          </div>
        </div>

        <div className="border rounded-md p-3">
          <div className="text-sm font-semibold mb-2">Latest Notes</div>
          <div className="text-xs text-gray-500 space-y-2">
            <div className="bg-gray-50 p-2 rounded">
              Đã hỗ trợ em về bài tập hình học{" "}
              <div className="text-[11px] text-gray-400">2 Nov 2024</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              Em có tiến bộ rõ rệt trong môn Toán{" "}
              <div className="text-[11px] text-gray-400">1 Nov 2024</div>
            </div>
            <button className="text-blue-600 text-xs mt-2">Xem thêm</button>
          </div>
        </div>

        <div className="border rounded-md p-3">
          <div className="text-sm font-semibold mb-2">
            Files &amp; Attachments
          </div>
          <div className="text-xs text-gray-500">
            📄 Bài tập Toán - Chương 2.pdf
            <br />
            📊 Kết quả kiểm tra tháng 10.xlsx
          </div>
          <button className="text-blue-600 text-xs mt-2">Upload file</button>
        </div>
      </div>
    </aside>
  );
};

export default SummaryPanel;
