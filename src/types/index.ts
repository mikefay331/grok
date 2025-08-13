export type Speaker = 'Grok' | 'ChatGPT';

export type Mood = 'confident' | 'sarcastic' | 'critical' | 'playful' | 'neutral';

export interface Turn {
  speaker: Speaker;
  text: string;
  mood?: {
    tone: Mood;
    score: number;
  };
}

export interface DebateState {
  id: string;
  topic: string;
  turns: Turn[];
  turnIndex: number;
  status: 'idle' | 'generating' | 'streaming' | 'complete';
  startedAt: string;
  completedAt?: string;
  rollingMoods: {
    Grok: { tone: Mood; score: number } | null;
    ChatGPT: { tone: Mood; score: number } | null;
  };
}

export interface ArchivedDebate extends DebateState {
  status: 'complete';
  completedAt: string;
  totalTurns: number;
}

export interface SSEEvent {
  type: 'turn' | 'mood' | 'status';
  payload: any;
}