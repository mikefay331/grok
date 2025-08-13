import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { ArchivedDebate, Turn, Mood } from '../../types';

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

const MessageBubble: React.FC<{ turn: Turn }> = ({ turn }) => {
  return (
    <div className={`mb-4 flex ${turn.speaker === "Grok" ? "justify-start" : "justify-end"}`}>
      <div className={`max-w-[80%] px-3 py-2 rounded ${turn.speaker === "Grok" ? "bg-gray-800 text-left" : "bg-gray-700 text-right"}`}>
        <div className="flex items-center mb-1">
          <span className={`font-mono font-bold ${turn.speaker === "Grok" ? "text-red-400" : "text-blue-400"}`}>
            {turn.speaker}
          </span>
          {turn.mood && (
            <span className={`ml-2 text-xs px-1 rounded ${getMoodColor(turn.mood.tone)}`}>
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

export default function ArchiveDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [debate, setDebate] = useState<ArchivedDebate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDebate() {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/archive/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch debate');
        }
        const data = await response.json();
        setDebate(data);
      } catch (error) {
        console.error('Error fetching archived debate:', error);
        setError('Failed to load debate. It may have been removed or never existed.');
      } finally {
        setLoading(false);
      }
    }

    fetchDebate();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-terminal-bg text-terminal-text font-mono p-4 flex items-center justify-center">
        <p className="animate-pulse">Loading debate...</p>
      </div>
    );
  }

  if (error || !debate) {
    return (
      <div className="min-h-screen bg-terminal-bg text-terminal-text font-mono p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl">Debate Not Found</h1>
            <Link href="/archive" className="hover:text-terminal-highlight underline transition-colors">
              Back to Archive
            </Link>
          </div>
          <div className="border border-red-800 bg-red-900/20 p-4 rounded">
            <p>{error || 'Debate not found'}</p>
            <Link href="/archive" className="block mt-4 text-terminal-highlight underline">
              Return to Archive
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{debate.topic} | Backrooms Terminal Archive</title>
        <meta name="description" content={`Archived debate between Grok and ChatGPT on ${debate.topic}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-terminal-bg text-terminal-text font-mono p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-xl truncate max-w-[70%]">Debate: {debate.topic}</h1>
            <div>
              <Link href="/archive" className="hover:text-terminal-highlight underline transition-colors mr-4">
                Back to Archive
              </Link>
              <Link href="/" className="hover:text-terminal-highlight underline transition-colors">
                Live Terminal
              </Link>
            </div>
          </div>

          <div className="mb-4 text-sm text-terminal-dimText">
            <div className="flex justify-between">
              <span>Debate #{debate.id.slice(0, 8)} • {debate.turns.length} turns</span>
              <span>
                {debate.startedAt && format(new Date(debate.startedAt), 'yyyy-MM-dd HH:mm')}
              </span>
            </div>
          </div>

          <div className="border border-terminal-border p-4 rounded mb-8 bg-black/30">
            <div className="space-y-2">
              {debate.turns.map((turn, index) => (
                <MessageBubble key={index} turn={turn} />
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <div className="text-terminal-dimText text-sm">
              {debate.completedAt && (
                <>Completed: {format(new Date(debate.completedAt), 'yyyy-MM-dd HH:mm:ss')}</>
              )}
            </div>
            
            <div className="flex space-x-6">
              {debate.rollingMoods.Grok && (
                <div className="text-sm">
                  <span className="text-red-400">Grok:</span> 
                  <span className={getMoodColor(debate.rollingMoods.Grok.tone)}>
                    {' '}{getMoodEmoji(debate.rollingMoods.Grok.tone)} {debate.rollingMoods.Grok.tone}
                  </span>
                </div>
              )}
              
              {debate.rollingMoods.ChatGPT && (
                <div className="text-sm">
                  <span className="text-blue-400">ChatGPT:</span> 
                  <span className={getMoodColor(debate.rollingMoods.ChatGPT.tone)}>
                    {' '}{getMoodEmoji(debate.rollingMoods.ChatGPT.tone)} {debate.rollingMoods.ChatGPT.tone}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}