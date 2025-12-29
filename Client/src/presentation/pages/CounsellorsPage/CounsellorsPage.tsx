import React, { useState } from "react";
import CounselorCard from "@/presentation/components/CounsellorsComponents/CounsellorCard";
import NavBar from "@/presentation/components/LandingPage/NaviBar";
import Footer from "@/presentation/components/LandingPage/Footer";
interface StyleConfig {
  card_background: string;
  text_color: string;
  font_family: string;
  font_size: number;
}

interface CardData {
  name: string;
  specialty: string;
  description: string;
  expertise: string[];
  availability: string;
  languages: string;
  themeColor: string;
  badgeText: string;
}

const COUNSELOR_DATA: CardData[] = [
  {
    name: "Bác sĩ Đạt",
    specialty: "Tiến sĩ tâm lý học lâm sàng",
    description:
      "Chuyên về lo âu, trầm cảm và liệu pháp hành vi nhận thức. Bác sĩ Đạt có hơn 12 năm kinh nghiệm trong việc giúp mọi người vượt qua các vấn đề về sức khỏe tinh thần.",
    expertise: ["Rối loạn lo âu", "Trầm cảm", "CBT"],
    availability: "Thứ 2 - Thứ 6",
    languages: "Tiếng Việt, Tiếng Anh",
    themeColor: "#8b5cf6",
    badgeText: "Đánh giá cao",
  },
  {
    name: "Bác sĩ Hiền",
    specialty: "Nhà trị liệu gia đình được cấp phép (LMFT)T",
    description:
      "Chuyên gia trong lĩnh vực động lực gia đình, trị liệu cho các cặp đôi và tư vấn mối quan hệ. Bác sĩ Hiền có 10 năm kinh nghiệm trong việc giúp các gia đình xây dựng mối liên kết bền chặt hơn.",
    expertise: ["Trị liệu cặp đôi", "Tư vấn gia đình", "Giao tiếp"],
    availability: "Thứ 3 - Thứ 7",
    languages: "Tiếng Việt, Tiếng Anh",
    themeColor: "#10b981",
    badgeText: "Được chứng nhận",
  },
  {
    name: "Bác sĩ Trinh",
    specialty: "Chuyên gia chấn thương tâm lý, Tiến sĩ Tâm lý (Psy.D.)",
    description:
      "Chuyên về hồi phục sau chấn thương, PTSD (rối loạn căng thẳng sau sang chấn), và liệu pháp EMDR. Bác sĩ Trinh đã dành 8 năm kinh nghiệm để giúp mọi người hồi phục từ những trải nghiệm chấn thương bằng các phương pháp dựa trên bằng chứng.",
    expertise: ["PTSD", "Liệu pháp EMDR", "Hồi phục sau tổn thương"],
    availability: "Thứ hai - Thứ năm",
    languages: "Tiếng Việt, Tiếng Anh",
    themeColor: "#f97316",
    badgeText: "Chuyên gia",
  },
];

const mockStyles: StyleConfig = {
  card_background: "#ffffff",
  text_color: "#1e293b",
  font_family: "system-ui, -apple-system, sans-serif",
  font_size: 16,
};

export default function CounselorCardsSection() {
  const [toast] = useState<string | null>(null);

  return (
    <>
      <div className="mb-10">
      <NavBar/>
      </div>

      <section className="py-16 px-6" style={{ backgroundColor: "#f8fafc" }}>
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-center mb-4"
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              color: mockStyles.text_color,
            }}
          >
              GẶP CHUYÊN GIA CỦA CHÚNG TÔI
          </h2>
          <p
            className="text-center mb-12 max-w-2xl mx-auto"
            style={{ fontSize: "1.125rem", color: "#64748b" }}
          >
            Những chuyên gia tận tâm, ân cần với sức khỏe tinh thần của bạn
          </p>

          <div
            className="counselors-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {COUNSELOR_DATA.map((data, index) => (
              <CounselorCard
                key={index}
                data={data}
                styles={mockStyles}
              />
            ))}
          </div>
        </div>
      </section>
            
      {toast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity">
          {toast}
        </div>
      )}

      <Footer />
    </>
  );
}
