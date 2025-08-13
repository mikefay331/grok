import { useEffect, useState } from 'react';
import Head from 'next/head';
import Terminal from '../components/Terminal';
import MoodAnalyzer from '../components/MoodAnalyzer';
import Header from '../components/Header';
import { useDebateStream } from '../hooks/useDebateStream';
import { ArchivedDebate } from '@/types';

export default function Home() {
  const { debateState, error, isConnected } = useDebateStream();
  const [archivedCount, setArchivedCount] = useState(0);
  
  // Fetch archived debate count
  useEffect(() => {
    async function fetchArchivedCount() {
      try {
        const response = await fetch('/api/archive/list');
        const data = await response.json() as ArchivedDebate[];
        setArchivedCount(data.length);
      } catch (error) {
        console.error('Error fetching archived debates:', error);
      }
    }
    
    fetchArchivedCount();
    const interval = setInterval(fetchArchivedCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>Backrooms Terminal: Grok vs ChatGPT</title>
        <meta name="description" content="Live AI debates between Grok and ChatGPT in a backrooms-themed terminal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen bg-black text-gray-300 font-mono">
        <Header archivedCount={archivedCount} />
        
        <div className="flex flex-col md:flex-row flex-1 p-4">
          <main className="md:w-2/3 pr-0 md:pr-4 mb-4 md:mb-0">
            <div className="h-full">
              <Terminal debate={debateState} />
              
              {error && (
                <div className="mt-2 p-2 bg-red-900 border border-red-700 rounded text-white text-xs">
                  <span>Error: {error}</span>
                </div>
              )}
            </div>
          </main>
          
          <aside className="md:w-1/3">
            <div className="p-4 bg-gray-900 border border-gray-800 rounded">
              <h2 className="text-lg text-green-500 mb-4">Agent Mood Analysis</h2>
              <MoodAnalyzer debate={debateState} />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}