import React from 'react';
import Head from 'next/head';
import Terminal from '../components/Terminal';
import { useDebateStream } from '../hooks/useDebateStream';

export default function Home() {
  const { debateState, error, isConnected } = useDebateStream();

  return (
    <>
      <Head>
        <title>Backrooms Terminal: Grok vs ChatGPT</title>
        <meta name="description" content="Live AI debates between Grok and ChatGPT in a backrooms-themed terminal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col h-screen bg-black">
        {error && (
          <div className="bg-red-900 text-white p-2 text-sm font-mono">
            {error}
          </div>
        )}
        
        <div className="flex-1 overflow-hidden">
          <Terminal debate={debateState} />
        </div>
      </main>
    </>
  );
}