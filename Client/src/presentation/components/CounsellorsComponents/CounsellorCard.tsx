import React from "react";

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

interface StyleConfig {
  card_background: string;
  text_color: string;
  font_family: string;
  font_size: number;
}

interface CounselorCardProps {
  data: CardData;
  styles: StyleConfig;
}

const CounselorCard: React.FC<CounselorCardProps> = ({ data, styles }) => {
  const baseSize = styles.font_size;

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
        backgroundColor: styles.card_background,
        fontFamily: styles.font_family,
        color: styles.text_color,
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
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z" />
            </svg>
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
          Availability
        </h4>

        <div className="flex flex-wrap gap-2">
          {data.expertise.map((item, idx) => (
            <span
              key={idx}
              className="
                inline-flex items-center
                rounded-full
              "
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
      <div
        className="border-t pt-4"
        style={{ borderColor: "#e2e8f0" }}
      >
        <div className="flex justify-between mb-2">
          <span
            className="text-gray-500"
            style={{ fontSize: "0.875rem" }}
          >
            Time
          </span>
          <span
            className="font-semibold"
            style={{
              fontSize: "0.875rem",
              color: styles.text_color,
            }}
          >
            {data.availability}
          </span>
        </div>

        <div className="flex justify-between">
          <span
            className="text-gray-500"
            style={{ fontSize: "0.875rem" }}
          >
            Languages
          </span>
          <span
            className="font-semibold"
            style={{
              fontSize: "0.875rem",
              color: styles.text_color,
            }}
          >
            {data.languages}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CounselorCard;
