import React from "react";
import { EmotionSlice } from "./EmotionSlice";
import { EmotionCategory } from "../types/emotion";
import { EMOTION_DATA } from "../constants/emotions";

interface EmotionWheelProps {
  selectedEmotions: string[];
  onEmotionSelect: (emotion: string, category: EmotionCategory) => void;
}

export function EmotionWheel({
  selectedEmotions,
  onEmotionSelect,
}: EmotionWheelProps) {
  const categories: EmotionCategory[] = [
    "Happy",
    "Surprised",
    "Fearful",
    "Angry",
    "Sad",
    "Bad",
  ];
  const anglePerCategory = 360 / categories.length;

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="text-center">
        <h2 className="mb-2">How are you feeling today?</h2>
        <p className="text-gray-600">
          Select the emotions that best describe how you're feeling right now
        </p>
      </div>

      <svg
        width="500"
        height="500"
        viewBox="0 0 500 500"
        className="max-w-full h-auto"
      >
        {categories.map((category, index) => (
          <EmotionSlice
            key={category}
            category={category}
            emotions={EMOTION_DATA[category]}
            startAngle={index * anglePerCategory - 90}
            endAngle={(index + 1) * anglePerCategory - 90}
            selected={selectedEmotions}
            onEmotionClick={onEmotionSelect}
          />
        ))}
      </svg>
    </div>
  );
}
