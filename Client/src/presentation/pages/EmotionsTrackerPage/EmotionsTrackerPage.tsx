import React, { useState, useMemo, useEffect } from "react";
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
  
  // Load initial state from local storage
  const [loggedEmotions, setLoggedEmotions] = useState<LoggedEmotion[]>(() => {
    if (typeof window === 'undefined') return [];
    
    try {
      const saved = localStorage.getItem('emotions_tracker_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load emotions from local storage:', error);
    }
    return [];
  });

  // Save to local storage whenever loggedEmotions changes
  useEffect(() => {
    localStorage.setItem('emotions_tracker_data', JSON.stringify(loggedEmotions));
  }, [loggedEmotions]);

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
