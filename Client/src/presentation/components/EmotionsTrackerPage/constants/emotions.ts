import { EmotionCategory } from '../types/emotion';

export const EMOTION_COLORS: Record<EmotionCategory, string> = {
  Happy: '#FFE66D',
  Sad: '#A8DADC',
  Angry: '#FFB3BA',
  Fearful: '#FFDAB3',
  Surprised: '#E0B0FF',
  Bad: '#B8E6B8',
};

export const EMOTION_DATA = {
  Happy: [
    'Playful', 'Content', 'Interested', 'Proud', 'Accepted', 'Powerful', 
    'Peaceful', 'Trusting', 'Optimistic', 'Cheerful', 'Respected', 
    'Valued', 'Courageous', 'Creative', 'Loving', 'Thankful', 'Sensitive'
  ],
  Sad: [
    'Lonely', 'Vulnerable', 'Despair', 'Guilty', 'Depressed', 'Hurt', 
    'Ashamed', 'Powerless', 'Empty', 'Inferior', 'Tired', 'Stressed', 
    'Relieved', 'Overwhelmed', 'Out of Control', 'Sleepy'
  ],
  Angry: [
    'Let Down', 'Humiliated', 'Bitter', 'Mad', 'Aggressive', 'Frustrated', 
    'Distant', 'Critical', 'Jealous', 'Irritated', 'Annoyed', 'Withdrawn', 
    'Skeptical', 'Dismissive'
  ],
  Fearful: [
    'Scared', 'Anxious', 'Insecure', 'Weak', 'Rejected', 'Threatened', 
    'Nervous', 'Exposed'
  ],
  Surprised: [
    'Startled', 'Confused', 'Amazed', 'Excited', 'Energetic', 'Awe', 
    'Astonished', 'Perplexed'
  ],
  Bad: [
    'Bored', 'Busy', 'Stressed', 'Tired', 'Inferior', 'Empty', 
    'Powerless', 'Ashamed', 'Overwhelmed', 'Out of Control', 'Sleepy', 
    'Rushed'
  ],
};
