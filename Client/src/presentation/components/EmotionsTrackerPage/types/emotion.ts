export interface Emotion {
  id: string;
  name: string;
  category: EmotionCategory;
}

export type EmotionCategory = 'Happy' | 'Sad' | 'Angry' | 'Fearful' | 'Surprised' | 'Bad';

export interface LoggedEmotion {
  id: string;
  emotionName: string;
  category: EmotionCategory;
  timestamp: Date;
}

export interface CategoryData {
  category: EmotionCategory;
  count: number;
}

export interface EmotionData {
  name: string;
  count: number;
  category: EmotionCategory;
}
