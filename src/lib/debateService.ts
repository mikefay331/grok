import { v4 as uuidv4 } from 'uuid';
import { formatISO } from 'date-fns';
import redis from './redis';
import openai from './openai';
import { DebateState, Turn, ArchivedDebate, Mood } from '../types';

// Constants
const DEBATE_KEY = 'current_debate';
const TOPIC_QUEUE_KEY = 'topic_queue';
const ARCHIVE_KEY = 'debate_archive';
const MIN_TOPIC_QUEUE_SIZE = 3;
const TOPICS_TO_GENERATE = 10;

// Generate a debate transcript using GPT-4o
export async function generateDebate(topic: string): Promise<Turn[]> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are simulating a debate between two AI models: Grok and ChatGPT.

Grok's persona: Sarcastic, irreverent, edgy, sometimes controversial, prone to making jokes and taking unusual positions. Often references memes or makes pop culture jokes. Occasionally makes light philosophical observations wrapped in humor.

ChatGPT's persona: Balanced, thoughtful, nuanced, careful about potential harms, and tends to present multiple perspectives. Values accuracy and helpful information. Takes a more measured tone.

Generate a detailed, substantive debate between them on the topic: "${topic}".

Return ONLY a JSON array where each object has "speaker" (either "Grok" or "ChatGPT") and "text" (their message).
Format: [{"speaker":"Grok","text":"..."}, {"speaker":"ChatGPT","text":"..."}]

The debate should have 10-12 turns total (5-6 per speaker) with Grok going first. Each speaker's turn should be 2-4 sentences. Ensure their personalities show through clearly.`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 1.0,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('Empty response from OpenAI');
    
    const result = JSON.parse(content);
    return result.length ? result : [];
  } catch (error) {
    console.error('Error generating debate:', error);
    throw error;
  }
}

// Analyze the mood of a turn using GPT-3.5-turbo
export async function analyzeMood(speaker: string, text: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Analyze the mood/tone of the following statement by ${speaker} and return ONLY a JSON object with:
1. "tone": One of ["confident", "sarcastic", "critical", "playful", "neutral"]
2. "score": A number from 0.0 to 1.0 indicating intensity

Return ONLY the JSON object, no other text.`
        },
        { role: 'user', content: text }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('Empty response from OpenAI');
    
    return JSON.parse(content);
  } catch (error) {
    console.error('Error analyzing mood:', error);
    // Return a default neutral mood if analysis fails
    return { tone: 'neutral' as Mood, score: 0.5 };
  }
}

// Generate new debate topics using GPT-3.5-turbo
export async function generateTopics() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Generate ${TOPICS_TO_GENERATE} interesting, diverse debate topics suitable for AI models to discuss.
Include a mix of:
- Current world events
- Technology and AI ethics
- Philosophical questions
- Absurdist or unusual scenarios
- Crypto, web3, or future tech topics

Return ONLY a JSON array of topic strings.`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 1.0,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('Empty response from OpenAI');
    
    const result = JSON.parse(content);
    return Array.isArray(result.topics) ? result.topics : [];
  } catch (error) {
    console.error('Error generating topics:', error);
    // Return some default topics if generation fails
    return [
      "Should AI systems have rights?",
      "Is cryptocurrency the future of finance?",
      "The ethics of AI-generated content",
      "Are we living in a simulation?",
      "Should social media be regulated?"
    ];
  }
}

// Get the current debate state
export async function getCurrentDebate(): Promise<DebateState | null> {
  const debate = await redis.get(DEBATE_KEY);
  return debate as DebateState | null;
}

// Initialize a new debate
export async function initializeDebate(topic: string, turns: Turn[]): Promise<DebateState> {
  const newDebate: DebateState = {
    id: uuidv4(),
    topic,
    turns,
    turnIndex: 0,
    status: 'streaming',
    startedAt: formatISO(new Date()),
    rollingMoods: {
      Grok: null,
      ChatGPT: null
    }
  };
  
  await redis.set(DEBATE_KEY, newDebate);
  return newDebate;
}

// Advance to the next turn
export async function advanceTurn(): Promise<DebateState | null> {
  const debate = await getCurrentDebate();
  if (!debate || debate.status !== 'streaming') return debate;
  
  if (debate.turnIndex < debate.turns.length - 1) {
    debate.turnIndex += 1;
    await redis.set(DEBATE_KEY, debate);
    
    // Analyze mood for the current turn (asynchronously)
    const turn = debate.turns[debate.turnIndex];
    analyzeMood(turn.speaker, turn.text).then(async (mood) => {
      debate.turns[debate.turnIndex].mood = mood;
      
      // Update rolling mood for the speaker
      if (!debate.rollingMoods[turn.speaker]) {
        debate.rollingMoods[turn.speaker] = mood;
      } else {
        const current = debate.rollingMoods[turn.speaker]!;
        debate.rollingMoods[turn.speaker] = {
          tone: mood.score > current.score ? mood.tone : current.tone,
          score: (current.score * 0.7) + (mood.score * 0.3) // Weighted average
        };
      }
      
      await redis.set(DEBATE_KEY, debate);
    });
    
    return debate;
  } else if (debate.turnIndex === debate.turns.length - 1) {
    // Last turn reached, mark as complete
    debate.status = 'complete';
    debate.completedAt = formatISO(new Date());
    await redis.set(DEBATE_KEY, debate);
    
    // Archive the debate
    await archiveDebate(debate);
    
    return debate;
  }
  
  return debate;
}

// Archive a completed debate
export async function archiveDebate(debate: DebateState) {
  if (debate.status !== 'complete') return;
  
  const archivedDebate: ArchivedDebate = {
    ...debate,
    status: 'complete',
    completedAt: debate.completedAt || formatISO(new Date()),
    totalTurns: debate.turns.length
  };
  
  // Add to archive list
  await redis.lpush(ARCHIVE_KEY, archivedDebate);
  
  // Keep only the latest 50 debates
  await redis.ltrim(ARCHIVE_KEY, 0, 49);
  
  // Also store individually by ID for quick access
  await redis.set(`debate:${debate.id}`, archivedDebate);
}

// Get the next topic from the queue
export async function getNextTopic(): Promise<string> {
  const topic = await redis.lpop(TOPIC_QUEUE_KEY);
  
  // If topic queue is getting low, refill it
  const queueSize = await redis.llen(TOPIC_QUEUE_KEY);
  if (queueSize < MIN_TOPIC_QUEUE_SIZE) {
    refillTopicQueue().catch(console.error);
  }
  
  return topic as string || "The future of artificial intelligence";
}

// Refill the topic queue
export async function refillTopicQueue() {
  const newTopics = await generateTopics();
  if (newTopics.length > 0) {
    await redis.rpush(TOPIC_QUEUE_KEY, ...newTopics);
  }
}

// Get archived debates
export async function getArchivedDebates(start = 0, end = 9): Promise<ArchivedDebate[]> {
  const debates = await redis.lrange(ARCHIVE_KEY, start, end);
  // Parse each JSON string into an ArchivedDebate object
  return debates.map(debate => JSON.parse(debate as string)) as ArchivedDebate[];
}

// Get a specific archived debate by ID
export async function getArchivedDebateById(id: string): Promise<ArchivedDebate | null> {
  const debate = await redis.get(`debate:${id}`);
  // Parse the JSON string if it exists
  return debate ? JSON.parse(debate as string) as ArchivedDebate : null;
}

// Start a new debate cycle
export async function startNewDebate(): Promise<DebateState> {
  // Get the next topic
  const topic = await getNextTopic();
  
  // Generate the debate
  const turns = await generateDebate(topic);
  
  // Initialize and return the new debate
  return initializeDebate(topic, turns);
}