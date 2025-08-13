import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { DebateState, Turn } from '@/types';

interface TerminalProps {
  debate: DebateState | null;
}

const getAgentColor = (agent: string): string => {
  switch (agent.toLowerCase()) {
    case 'grok': return 'text-red-500';
    case 'chatgpt': return 'text-green-500';
    default: return 'text-gray-500';
  }
};

export default function Terminal({ debate }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [initTime] = useState(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [debate?.turnIndex]);

  // Get visible messages based on current turn index
  const visibleMessages = debate?.turns
    ? debate.turns.slice(0, debate.turnIndex + 1)
    : [];
    
  return (
    <div className="flex flex-col h-[600px] border border-gray-700 rounded bg-black overflow-hidden bg-noise">
      <div className="flex items-center justify-between bg-gray-900 px-4 py-2 border-b border-gray-700">
        <div className="text-sm text-gray-400">
          Backrooms Terminal - {debate?.topic || 'Initializing...'}
          {debate?.status === 'complete' && <span className="ml-2 text-yellow-500">(Complete)</span>}
        </div>
        <div className="text-xs text-gray-500">
          {initTime}
        </div>
      </div>
      
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm text-green-100 bg-black"
      >
        {!debate && (
          <div className="text-gray-500 mb-4">
            <span>Initializing backrooms terminal...</span>
          </div>
        )}
        
        {debate && (
          <>
            <div className="mb-4">
              <div className="flex items-start">
                <span className="text-gray-500">[system]</span>
                <div className="ml-2 flex-1">
                  <div>Debate initialized. Agents loaded. Engaging argumentative protocols...</div>
                </div>
              </div>
            </div>
            
            {visibleMessages.map((message, i) => (
              <div key={i} className="mb-4">
                <div className="flex items-start">
                  <span className={`font-bold ${getAgentColor(message.speaker)}`}>
                    [{message.speaker}]
                  </span>
                  <div className="ml-2 flex-1">
                    <div className="whitespace-pre-wrap">
                      {message.text}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        
        {debate?.status === 'streaming' && debate.turnIndex < debate.turns.length - 1 && (
          <div className="flex items-center text-gray-500">
            <span className="mr-2">[system]</span>
            <span className="terminal-cursor"></span>
          </div>
        )}
      </div>
    </div>
  );
}