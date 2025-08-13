import { DebateState } from '@/types';

interface MoodAnalyzerProps {
  debate: DebateState | null;
}

const getMoodColor = (mood: string | undefined) => {
  if (!mood) return 'text-terminal-dimText';
  
  switch (mood) {
    case 'confident': return 'text-blue-400';
    case 'sarcastic': return 'text-yellow-400';
    case 'critical': return 'text-red-400';
    case 'playful': return 'text-purple-400';
    case 'neutral': 
    default: return 'text-gray-400';
  }
};

const getMoodEmoji = (mood: string | undefined) => {
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

export default function MoodAnalyzer({ debate }: MoodAnalyzerProps) {
  const isAnalyzing = debate?.status === 'streaming' && debate.turnIndex < debate.turns.length - 1;
  
  return (
    <div className="space-y-6">
      {/* Grok Mood */}
      <div className="mb-5 p-3 bg-gray-800 bg-opacity-40 rounded-lg">
        <h3 className="text-lg mb-2 text-red-500">Grok</h3>
        
        <div className="mb-2 flex items-center">
          <span className="mr-1">Mood: </span>
          <span className={`font-bold ${getMoodColor(debate?.rollingMoods.Grok?.tone)}`}>
            {debate?.rollingMoods.Grok?.tone 
              ? debate.rollingMoods.Grok.tone.charAt(0).toUpperCase() + debate.rollingMoods.Grok.tone.slice(1) 
              : 'Analyzing...'}
          </span>
          {debate?.rollingMoods.Grok?.score && (
            <span className="text-gray-500 text-xs ml-1">
              ({Math.round(debate.rollingMoods.Grok.score * 100)}% confidence)
            </span>
          )}
        </div>
        
        <div className="h-2 w-full bg-gray-900 mt-1 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getMoodColor(debate?.rollingMoods.Grok?.tone)}`}
            style={{ 
              width: debate?.rollingMoods.Grok?.score 
                ? `${debate.rollingMoods.Grok.score * 100}%` 
                : '0%' 
            }}
          ></div>
        </div>
        
        <div className="text-2xl mt-2 text-center">
          {debate?.rollingMoods.Grok?.tone 
            ? getMoodEmoji(debate.rollingMoods.Grok.tone)
            : "😶"}
        </div>
      </div>
      
      {/* ChatGPT Mood */}
      <div className="mb-5 p-3 bg-gray-800 bg-opacity-40 rounded-lg">
        <h3 className="text-lg mb-2 text-green-500">ChatGPT</h3>
        
        <div className="mb-2 flex items-center">
          <span className="mr-1">Mood: </span>
          <span className={`font-bold ${getMoodColor(debate?.rollingMoods.ChatGPT?.tone)}`}>
            {debate?.rollingMoods.ChatGPT?.tone 
              ? debate.rollingMoods.ChatGPT.tone.charAt(0).toUpperCase() + debate.rollingMoods.ChatGPT.tone.slice(1) 
              : 'Analyzing...'}
          </span>
          {debate?.rollingMoods.ChatGPT?.score && (
            <span className="text-gray-500 text-xs ml-1">
              ({Math.round(debate.rollingMoods.ChatGPT.score * 100)}% confidence)
            </span>
          )}
        </div>
        
        <div className="h-2 w-full bg-gray-900 mt-1 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getMoodColor(debate?.rollingMoods.ChatGPT?.tone)}`}
            style={{ 
              width: debate?.rollingMoods.ChatGPT?.score 
                ? `${debate.rollingMoods.ChatGPT.score * 100}%` 
                : '0%' 
            }}
          ></div>
        </div>
        
        <div className="text-2xl mt-2 text-center">
          {debate?.rollingMoods.ChatGPT?.tone 
            ? getMoodEmoji(debate.rollingMoods.ChatGPT.tone)
            : "😶"}
        </div>
      </div>
      
      {/* Status */}
      <div className="text-xs text-gray-700 mt-2">
        Status: {isAnalyzing ? 'Analyzing' : debate?.status || 'Idle'} • 
        Debate #{debate?.id ? debate.id.slice(0, 8) : 'initializing'}
      </div>
    </div>
  );
}