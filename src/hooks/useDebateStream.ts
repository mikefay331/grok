import { useState, useEffect } from 'react';
import { DebateState, SSEEvent } from '../types';

export function useDebateStream() {
  const [debateState, setDebateState] = useState<DebateState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let eventSource: EventSource;

    const connectSSE = () => {
      try {
        // Close any existing connection
        if (eventSource) {
          eventSource.close();
        }

        // Create a new SSE connection
        eventSource = new EventSource('/api/debate/stream');
        setIsConnected(true);

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as SSEEvent;
            
            if (data.type === 'status' || data.type === 'turn') {
              setDebateState(data.payload);
            } else if (data.type === 'mood') {
              setDebateState(prev => {
                if (!prev) return prev;
                
                const updatedTurns = [...prev.turns];
                const { turnIndex, speaker, mood } = data.payload;
                
                if (updatedTurns[turnIndex]) {
                  updatedTurns[turnIndex].mood = mood;
                }
                
                // Update rolling mood if this is for the current speaker
                const rollingMoods = { ...prev.rollingMoods };
                if (speaker && mood) {
                  rollingMoods[speaker] = mood;
                }
                
                return {
                  ...prev,
                  turns: updatedTurns,
                  rollingMoods
                };
              });
            }
          } catch (err) {
            console.error('Error parsing SSE data:', err);
          }
        };

        eventSource.onerror = (err) => {
          console.error('SSE error:', err);
          setError('Connection error. Reconnecting...');
          setIsConnected(false);
          
          // Close the connection
          eventSource.close();
          
          // Attempt to reconnect after a delay
          setTimeout(connectSSE, 3000);
        };
      } catch (err) {
        console.error('Failed to connect to SSE:', err);
        setError('Failed to connect. Retrying...');
        setIsConnected(false);
        
        // Attempt to reconnect after a delay
        setTimeout(connectSSE, 3000);
      }
    };

    connectSSE();

    // Cleanup on unmount
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return { debateState, error, isConnected };
}