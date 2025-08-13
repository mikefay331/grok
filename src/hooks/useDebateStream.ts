import { useState, useEffect } from 'react';
import { DebateState, Turn, Mood } from '../types';

// Define valid speaker types
type SpeakerType = 'Grok' | 'ChatGPT';

interface MoodUpdate {
  tone: Mood;
  score: number;
}

export function useDebateStream() {
  const [debateState, setDebateState] = useState<DebateState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let retryTimeout: NodeJS.Timeout | null = null;

    const connectToStream = () => {
      try {
        eventSource = new EventSource('/api/debate/stream');
        setIsConnected(true);

        eventSource.onopen = () => {
          setIsConnected(true);
          setError(null);
        };

        eventSource.onerror = (e) => {
          setIsConnected(false);
          eventSource?.close();
          
          // Retry connection after 5 seconds
          retryTimeout = setTimeout(connectToStream, 5000);
        };

        eventSource.addEventListener('debate-update', (event) => {
          try {
            const data = JSON.parse(event.data);
            setDebateState((prev) => {
              if (!prev) return data;
              
              // Update mood if provided
              const { speaker, mood } = data;
              const rollingMoods = { ...prev.rollingMoods };
              
              // Only update if speaker is a valid key and mood exists
              if (speaker && mood && (speaker === 'Grok' || speaker === 'ChatGPT')) {
                rollingMoods[speaker as SpeakerType] = mood;
              }
              
              return {
                ...prev,
                ...data,
                rollingMoods
              };
            });
          } catch (err) {
            console.error('Error parsing debate update:', err);
          }
        });

        eventSource.addEventListener('error-update', (event) => {
          try {
            const data = JSON.parse(event.data);
            setError(data.message || 'An error occurred');
          } catch (err) {
            setError('An error occurred in the debate stream');
          }
        });
      } catch (err) {
        setIsConnected(false);
        setError('Failed to connect to debate stream');
        
        // Retry connection after 5 seconds
        retryTimeout = setTimeout(connectToStream, 5000);
      }
    };

    connectToStream();

    // Cleanup function
    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, []);

  return { debateState, error, isConnected };
}