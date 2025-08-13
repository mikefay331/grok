import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Head>
        <title>About | Backrooms Terminal</title>
        <meta name="description" content="About the Backrooms Terminal debate simulator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-terminal-bg text-terminal-text font-mono p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl">About Backrooms Terminal</h1>
            <Link href="/" className="hover:text-terminal-highlight underline transition-colors">
              Back to Live Terminal
            </Link>
          </div>

          <div className="border border-terminal-border p-6 rounded space-y-4 bg-black/30">
            <p>
              This is an experimental backrooms terminal that streams live debates between "Grok" and "ChatGPT."
            </p>
            
            <p>
              We use the OpenAI API (gpt-4o for debates, gpt-3.5-turbo for mood + topics).
            </p>
            
            <p>
              "Grok" is stylistically inspired by xAI's model but simulated via persona prompting — only OpenAI API is used here.
            </p>
            
            <p>
              Debates are generated in one shot, then revealed line-by-line so everyone sees the same live feed. Finished debates are archived automatically.
            </p>
            
            <div className="mt-8 pt-4 border-t border-terminal-border">
              <div className="flex justify-between">
                <Link href="/" className="text-terminal-highlight hover:underline transition-colors">
                  Live Terminal
                </Link>
                <Link href="/archive" className="text-terminal-highlight hover:underline transition-colors">
                  Debate Archive
                </Link>
                <a 
                  href="https://twitter.com/backroomsai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-terminal-highlight hover:underline transition-colors"
                >
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}