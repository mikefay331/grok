import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DebateState, Turn, Mood } from '../types';

interface TerminalProps {
  debate: DebateState | null;
}

const getMoodColor = (mood: Mood | undefined) => {
  if (!mood) return 'text-terminal-dimText';
  
  switch (mood) {
    case 'confident': return 'text-blue-400';
    case 'sarcastic': return 'text-yellow-400';
    case 'critical': return 'text-red-400';
    case 'playful': return 'text-purple-400';
    case 'neutral': 
    default: return 'text-terminal-dimText';
  }
};

const getMoodEmoji = (mood: Mood | undefined) => {
  if (!mood) return '🔄';
  
  switch (mood) {
    case 'confident': return '💪';
    case 'sarcastic': return '🙄';
    case 'critical': return '🔍';
    case 'playful': return '😏';
    case 'neutral': 
    default: return '😐';
  }
};

const TerminalHeader: React.FC = () => (
  <div className="flex justify-between items-center px-4 py-2 bg-terminal-bg border-b border-terminal-border">
    <div className="text-terminal-text font-mono">Backrooms Terminal v1.0</div>
    <a 
      href="https://twitter.com/backroomsai" 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-terminal-text hover:text-terminal-highlight transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
      </svg>
    </a>
  </div>
);

const TerminalFooter: React.FC<{ debate: DebateState | null }> = ({ debate }) => {
  if (!debate) return null;
  
  return (
    <div className="px-4 py-2 bg-terminal-bg border-t border-terminal-border text-terminal-dimText font-mono text-sm">
      {debate.status === 'streaming' ? (
        <>Debate #{debate.id.slice(0, 8)} — Topic: {debate.topic} — Turn {debate.turnIndex + 1}/{debate.turns.length}</>
      ) : debate.status === 'complete' ? (
        <>Debate #{debate.id.slice(0, 8)} — Topic: {debate.topic} — Complete</>
      ) : (
        <>Initializing new debate...</>
      )}
    </div>
  );
};

const MoodGauge: React.FC<{ 
  speaker: string, 
  mood: { tone: Mood; score: number } | null 
}> = ({ speaker, mood }) => (
  <div className="flex flex-col items-center mb-4">
    <div className="text-terminal-text font-mono mb-1">{speaker}</div>
    <div className={classNames(
      "text-2xl",
      mood ? getMoodColor(mood.tone) : "text-terminal-dimText"
    )}>
      {mood ? getMoodEmoji(mood.tone) : "😶"}
    </div>
    <div className="h-1 w-full bg-terminal-dimText/30 mt-1 rounded-full overflow-hidden">
      <div 
        className={classNames(
          "h-full",
          mood ? getMoodColor(mood.tone) : "bg-terminal-dimText"
        )}
        style={{ width: mood ? `${mood.score * 100}%` : '0%' }}
      ></div>
    </div>
    <div className="text-terminal-dimText text-xs font-mono mt-1">
      {mood ? mood.tone : "analyzing..."}
    </div>
  </div>
);

const MessageBubble: React.FC<{ turn: Turn; visible: boolean }> = ({ turn, visible }) => {
  if (!visible) return null;
  
  return (
    <div className={classNames(
      "mb-4 flex",
      turn.speaker === "Grok" ? "justify-start" : "justify-end"
    )}>
      <div className={classNames(
        "max-w-[80%] px-3 py-2 rounded",
        turn.speaker === "Grok" ? "bg-gray-800 text-left" : "bg-gray-700 text-right"
      )}>
        <div className="flex items-center mb-1">
          <span className={classNames(
            "font-mono font-bold",
            turn.speaker === "Grok" ? "text-red-400" : "text-blue-400"
          )}>
            {turn.speaker}
          </span>
          {turn.mood && (
            <span 
              className={classNames(
                "ml-2 text-xs px-1 rounded",
                getMoodColor(turn.mood.tone)
              )}
            >
              {getMoodEmoji(turn.mood.tone)} {turn.mood.tone}
            </span>
          )}
        </div>
        <div className="text-terminal-text font-mono whitespace-pre-wrap">
          {turn.text}
        </div>
      </div>
    </div>
  );
};

const Terminal: React.FC<TerminalProps> = ({ debate }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [debate?.turnIndex]);

  return (
    <div className="flex flex-col h-full">
      <TerminalHeader />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main terminal area */}
        <div className="flex-1 p-4 overflow-y-auto bg-terminal-bg">
          <div className="space-y-2">
            {debate?.status === 'streaming' && (
              <>
                <div className="text-terminal-text font-mono mb-4 text-center">
                  <span className="px-2 py-1 bg-terminal-border rounded">
                    Debate Topic: {debate.topic}
                  </span>
                </div>
                
                {debate.turns.map((turn, index) => (
                  <MessageBubble 
                    key={index} 
                    turn={turn} 
                    visible={index <= debate.turnIndex} 
                  />
                ))}
                
                {/* Auto-scroll anchor */}
                <div ref={messagesEndRef} />
                
                {/* Typing indicator for next message */}
                {debate.turnIndex < debate.turns.length - 1 && (
                  <div className="text-terminal-dimText font-mono animate-pulse">
                    <span className="inline-block animate-cursor-blink">_</span>
                  </div>
                )}
              </>
            )}
            
            {(!debate || debate.status === 'idle') && (
              <div className="text-terminal-text font-mono text-center mt-8">
                <div className="mb-4">Initializing backrooms terminal...</div>
                <div className="animate-pulse">
                  <span className="inline-block animate-cursor-blink">_</span>
                </div>
              </div>
            )}
            
            {debate?.status === 'complete' && (
              <div className="text-terminal-text font-mono text-center mt-4">
                <div className="mb-2">Debate complete.</div>
                <div className="text-terminal-dimText text-sm">
                  Next debate starting soon...
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right sidebar for mood gauges */}
        {debate?.status === 'streaming' && (
          <div className="w-48 p-4 bg-terminal-bg border-l border-terminal-border flex flex-col">
            <div className="text-terminal-text font-mono mb-4 text-center">Mood Analysis</div>
            <MoodGauge 
              speaker="Grok" 
              mood={debate.rollingMoods.Grok} 
            />
            <MoodGauge 
              speaker="ChatGPT" 
              mood={debate.rollingMoods.ChatGPT} 
            />
          </div>
        )}
      </div>
      
      <TerminalFooter debate={debate} />
    </div>
  );
};

export default Terminal;