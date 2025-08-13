// Define mood types
export type Mood = 'confident' | 'sarcastic' | 'critical' | 'playful' | 'neutral';

// Define turn structure
export interface Turn {
  speaker: string;
  text: string;
  mood?: {
    tone: Mood;
    score: number;
  };
}

// Define debate state
export interface DebateState {
  id: string;
  topic: string;
  turns: Turn[];
  turnIndex: number;
  status: 'streaming' | 'complete';
  startedAt: string;
  completedAt?: string;
  rollingMoods: {
    Grok: { tone: Mood; score: number; } | null;
    ChatGPT: { tone: Mood; score: number; } | null;
  };
}

// Define archived debate
export interface ArchivedDebate extends DebateState {
  totalTurns: number;
}