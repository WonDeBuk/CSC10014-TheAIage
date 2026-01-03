import React from 'react';
import { Trash2 } from 'lucide-react';
import { LoggedEmotion } from '../types/emotion';
import { EMOTION_COLORS } from "../constants/emotions";

interface EmotionItemProps {
  emotion: LoggedEmotion;
  onDelete: (id: string) => void;
}

export function EmotionItem({ emotion, onDelete }: EmotionItemProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const backgroundColor = EMOTION_COLORS[emotion.category];

  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-lg transition-all hover:shadow-sm"
      style={{ backgroundColor, opacity: 0.8 }}
    >
      <span className="font-medium text-gray-800">{emotion.emotionName}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">{formatTime(emotion.timestamp)}</span>
        <button
          onClick={() => onDelete(emotion.id)}
          className="p-1 rounded hover:bg-white/30 transition-colors"
          aria-label="Delete emotion"
        >
          <Trash2 className="w-4 h-4 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
