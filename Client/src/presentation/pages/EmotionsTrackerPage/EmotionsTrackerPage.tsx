import React, { useState, useMemo } from "react";
import { EmotionWheel } from "@/presentation/components/EmotionsTrackerPage/emotion/EmotionWheel";
import { TodayEmotions } from "@/presentation/components/EmotionsTrackerPage/today/TodayEmotions";
import { CategoryChart } from "@/presentation/components/EmotionsTrackerPage/analytics/CategoryChart";
import { EmotionChart } from "@/presentation/components/EmotionsTrackerPage/analytics/EmotionChart";
import {
  LoggedEmotion,
  EmotionCategory,
  CategoryData,
  EmotionData,
} from "@/presentation/components/EmotionsTrackerPage/types/emotion";

export default function App() {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [loggedEmotions, setLoggedEmotions] = useState<LoggedEmotion[]>([
    {
      id: "1",
      emotionName: "Rushed",
      category: "Bad",
      timestamp: new Date(2026, 0, 2, 0, 7),
    },
    {
      id: "2",
      emotionName: "Guilty",
      category: "Sad",
      timestamp: new Date(2026, 0, 2, 1, 15),
    },
    {
      id: "3",
      emotionName: "Courageous",
      category: "Happy",
      timestamp: new Date(2026, 0, 2, 2, 30),
    },
    {
      id: "4",
      emotionName: "Insecure",
      category: "Fearful",
      timestamp: new Date(2026, 0, 2, 3, 45),
    },
    {
      id: "5",
      emotionName: "Annoyed",
      category: "Angry",
      timestamp: new Date(2026, 0, 2, 4, 20),
    },
    {
      id: "6",
      emotionName: "Energetic",
      category: "Surprised",
      timestamp: new Date(2026, 0, 2, 5, 10),
    },
    {
      id: "7",
      emotionName: "Threatened",
      category: "Fearful",
      timestamp: new Date(2026, 0, 2, 6, 0),
    },
    {
      id: "8",
      emotionName: "Critical",
      category: "Angry",
      timestamp: new Date(2026, 0, 2, 7, 22),
    },
    {
      id: "9",
      emotionName: "Hurt",
      category: "Sad",
      timestamp: new Date(2026, 0, 2, 8, 14),
    },
    {
      id: "10",
      emotionName: "Excited",
      category: "Surprised",
      timestamp: new Date(2026, 0, 2, 9, 37),
    },
  ]);

  const handleEmotionSelect = (emotion: string, category: EmotionCategory) => {
    const newEmotion: LoggedEmotion = {
      id: Date.now().toString(),
      emotionName: emotion,
      category,
      timestamp: new Date(),
    };

    setLoggedEmotions([...loggedEmotions, newEmotion]);

    if (!selectedEmotions.includes(emotion)) {
      setSelectedEmotions([...selectedEmotions, emotion]);
    }
  };

  const handleDeleteEmotion = (id: string) => {
    setLoggedEmotions(loggedEmotions.filter((e) => e.id !== id));
  };

  const categoryData = useMemo((): CategoryData[] => {
    const categories: EmotionCategory[] = [
      "Happy",
      "Sad",
      "Angry",
      "Fearful",
      "Surprised",
      "Bad",
    ];
    return categories.map((category) => ({
      category,
      count: loggedEmotions.filter((e) => e.category === category).length,
    }));
  }, [loggedEmotions]);

  const emotionData = useMemo((): EmotionData[] => {
    const emotionCounts = new Map<
      string,
      { count: number; category: EmotionCategory }
    >();

    loggedEmotions.forEach((emotion) => {
      const current = emotionCounts.get(emotion.emotionName);
      if (current) {
        emotionCounts.set(emotion.emotionName, {
          count: current.count + 1,
          category: emotion.category,
        });
      } else {
        emotionCounts.set(emotion.emotionName, {
          count: 1,
          category: emotion.category,
        });
      }
    });

    return Array.from(emotionCounts.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        category: data.category,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }, [loggedEmotions]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Emotion Wheel Section */}
        <EmotionWheel
          selectedEmotions={selectedEmotions}
          onEmotionSelect={handleEmotionSelect}
        />

        {/* Today's Emotions Section */}
        <TodayEmotions
          emotions={loggedEmotions}
          onDeleteEmotion={handleDeleteEmotion}
        />

        {/* Analytics Section */}
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryChart data={categoryData} />
            <EmotionChart data={emotionData} />
          </div>
        </div>
      </div>
    </div>
  );
}
