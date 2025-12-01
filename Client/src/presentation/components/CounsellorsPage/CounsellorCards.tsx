import React from "react";

// ----- Dữ liệu + style mặc định -----
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
    specialty: "Nhà trị liệu gia đình được cấp phép (LMFT)",
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
    availability: "Thứ 2 - Thứ 5",
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

// ----- Component hiển thị từng card -----
const CounsellorCard: React.FC<{ data: CardData }> = ({ data }) => {
  const baseSize = mockStyles.font_size;

  return (
    <div
      className="
        counselor-card
        w-[340px] sm:w-[360px]
        bg-white rounded-2xl shadow-lg
        p-6 sm:p-8
        transition-all duration-300
        hover:-translate-y-2 hover:shadow-2xl
        relative overflow-hidden
        flex flex-col
      "
      style={{
        backgroundColor: mockStyles.card_background,
        fontFamily: mockStyles.font_family,
        color: mockStyles.text_color,
      }}
    >
      {/* Avatar + badge */}
      <div className="mb-6">
        <div
          className="
            w-24 h-24 rounded-full mx-auto mb-4
            flex items-center justify-center
          "
          style={{
            background: `linear-gradient(135deg, ${data.themeColor} 0%, #065f46 100%)`,
          }}
        >
          <svg
            className="w-12 h-12 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>

        <div className="text-center mb-4">
          <span
            className="
              inline-flex items-center gap-2
              rounded-full
              text-[0.875rem] font-medium
            "
            style={{
              backgroundColor: `${data.themeColor}1A`,
              color: data.themeColor,
              padding: "0.25rem 0.75rem",
            }}
          >
            {data.badgeText}
          </span>
        </div>
      </div>

      {/* Name + specialty */}
      <h3
        className="text-center mb-2"
        style={{
          fontSize: `${baseSize * 1.5}px`,
          fontWeight: 700,
        }}
      >
        {data.name}
      </h3>

      <p
        className="text-center mb-4"
        style={{
          fontSize: `${baseSize}px`,
          fontWeight: 600,
          color: data.themeColor,
        }}
      >
        {data.specialty}
      </p>

      {/* Description */}
      <p
        className="mb-6"
        style={{
          fontSize: `${baseSize * 0.95}px`,
          color: "#64748b",
          lineHeight: 1.7,
        }}
      >
        {data.description}
      </p>

      {/* Expertise */}
      <div className="mb-6">
        <h4
          className="mb-3 uppercase tracking-[0.05em]"
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
          }}
        >
          Expertise
        </h4>

        <div className="flex flex-wrap gap-2">
          {data.expertise.map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center rounded-full"
              style={{
                backgroundColor: "#f1f5f9",
                color: "#475569",
                fontSize: "0.8rem",
                padding: "0.25rem 0.75rem",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Availability & languages */}
      <div className="border-t pt-4" style={{ borderColor: "#e2e8f0" }}>
        <div className="flex justify-between mb-2">
          <span className="text-gray-500" style={{ fontSize: "0.875rem" }}>
            Time
          </span>
          <span
            className="font-semibold"
            style={{
              fontSize: "0.875rem",
              color: mockStyles.text_color,
            }}
          >
            {data.availability}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500" style={{ fontSize: "0.875rem" }}>
            Languages
          </span>
          <span
            className="font-semibold"
            style={{
              fontSize: "0.875rem",
              color: mockStyles.text_color,
            }}
          >
            {data.languages}
          </span>
        </div>
      </div>
    </div>
  );
};

// ----- Component hiển thị toàn bộ danh sách chuyên gia -----
const CounsellorCards: React.FC = () => {
  return (
    <div className="hero-bg w-full py-30">
      <div
        className="counselors-grid px-6 max-w-6xl mx-auto"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        {COUNSELOR_DATA.map((data, idx) => (
          <CounsellorCard key={idx} data={data} />
        ))}
      </div>
    </div>
  );
};

export default CounsellorCards;
