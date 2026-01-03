import React from "react";
import { EmotionItem } from "./EmotionItem";
import { LoggedEmotion } from "../types/emotion";

interface TodayEmotionsProps {
  emotions: LoggedEmotion[];
  onDeleteEmotion: (id: string) => void;
}

export function TodayEmotions({
  emotions,
  onDeleteEmotion,
}: TodayEmotionsProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-purple-400 p-6">
          <h2 className="text-white">Today's Emotions</h2>
        </div>

        <div className="p-6">
          {emotions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No emotions logged yet. Select from the wheel above to get
              started.
            </p>
          ) : (
            <div className="space-y-3">
              {emotions.map((emotion) => (
                <EmotionItem
                  key={emotion.id}
                  emotion={emotion}
                  onDelete={onDeleteEmotion}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
