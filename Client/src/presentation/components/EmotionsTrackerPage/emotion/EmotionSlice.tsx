import React from "react";
import { EmotionCategory } from "../types/emotion";
import { EMOTION_COLORS } from "../constants/emotions";

interface EmotionSliceProps {
  category: EmotionCategory;
  emotions: string[];
  startAngle: number;
  endAngle: number;
  selected: string[];
  onEmotionClick: (emotion: string, category: EmotionCategory) => void;
}

export function EmotionSlice({
  category,
  emotions,
  startAngle,
  endAngle,
  selected,
  onEmotionClick,
}: EmotionSliceProps) {
  const centerX = 250;
  const centerY = 250;
  const outerRadius = 240;
  const innerRadius = 80;
  const color = EMOTION_COLORS[category];

  const createSlicePath = (
    innerR: number,
    outerR: number,
    start: number,
    end: number
  ) => {
    const startRad = (start * Math.PI) / 180;
    const endRad = (end * Math.PI) / 180;

    const x1 = centerX + innerR * Math.cos(startRad);
    const y1 = centerY + innerR * Math.sin(startRad);
    const x2 = centerX + outerR * Math.cos(startRad);
    const y2 = centerY + outerR * Math.sin(startRad);
    const x3 = centerX + outerR * Math.cos(endRad);
    const y3 = centerY + outerR * Math.sin(endRad);
    const x4 = centerX + innerR * Math.cos(endRad);
    const y4 = centerY + innerR * Math.sin(endRad);

    const largeArc = end - start > 180 ? 1 : 0;

    return `M ${x1} ${y1} L ${x2} ${y2} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x1} ${y1} Z`;
  };

  const getTextPosition = (radius: number, angle: number) => {
    const angleRad = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(angleRad),
      y: centerY + radius * Math.sin(angleRad),
    };
  };

  const totalAngle = endAngle - startAngle;
  const anglePerEmotion = totalAngle / emotions.length;

  // Main category slice
  const categoryPath = createSlicePath(
    innerRadius,
    innerRadius + 40,
    startAngle,
    endAngle
  );
  const categoryAngle = startAngle + totalAngle / 2;
  const categoryPos = getTextPosition(innerRadius + 20, categoryAngle);

  return (
    <g>
      {/* Main category section */}
      <path
        d={categoryPath}
        fill={color}
        opacity={0.9}
        className="cursor-pointer transition-opacity hover:opacity-100"
      />
      <text
        x={categoryPos.x}
        y={categoryPos.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#000"
        fontSize="14"
        fontWeight="600"
      >
        {category}
      </text>

      {/* Sub-emotions */}
      {emotions.map((emotion, index) => {
        const emotionStartAngle = startAngle + index * anglePerEmotion;
        const emotionEndAngle = emotionStartAngle + anglePerEmotion;
        const emotionMidAngle = emotionStartAngle + anglePerEmotion / 2;

        const radiusStart = innerRadius + 40;
        const radiusEnd = outerRadius;
        const emotionPath = createSlicePath(
          radiusStart,
          radiusEnd,
          emotionStartAngle,
          emotionEndAngle
        );

        const textRadius = radiusStart + (radiusEnd - radiusStart) * 0.6;
        const textPos = getTextPosition(textRadius, emotionMidAngle);

        const isSelected = selected.includes(emotion);

        return (
          <g key={emotion}>
            <path
              d={emotionPath}
              fill={color}
              opacity={isSelected ? 1 : 0.6}
              stroke="#fff"
              strokeWidth={isSelected ? 3 : 1}
              className="cursor-pointer transition-all hover:opacity-100"
              onClick={() => onEmotionClick(emotion, category)}
            />
            <text
              x={textPos.x}
              y={textPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#000"
              fontSize="10"
              fontWeight={isSelected ? "600" : "400"}
              className="pointer-events-none"
              transform={`rotate(${emotionMidAngle}, ${textPos.x}, ${textPos.y})`}
            >
              {emotion}
            </text>
          </g>
        );
      })}
    </g>
  );
}
