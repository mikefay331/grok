import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArchivedDebate } from '../../types';

export default function ArchiveList() {
  const [debates, setDebates] = useState<ArchivedDebate[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function fetchDebates() {
      setLoading(true);
      try {
        const response = await fetch(`/api/archive/list?page=${page}`);
        const data = await response.json();
        setDebates(prev => page === 0 ? data : [...prev, ...data]);
        setHasMore(data.length === 10); // Assuming 10 items per page
      } catch (error) {
        console.error('Error fetching archived debates:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDebates();
  }, [page]);

  return (
    <>
      <Head>
        <title>Archive | Backrooms Terminal</title>
        <meta name="description" content="Archive of past AI debates between Grok and ChatGPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-terminal-bg text-terminal-text font-mono p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl">Debate Archive</h1>
            <Link href="/" className="hover:text-terminal-highlight underline transition-colors">
              Back to Live Terminal
            </Link>
          </div>

          {debates.length === 0 && !loading ? (
            <div className="text-center py-12">
              <p>No archived debates found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {debates.map((debate) => (
                <Link 
                  href={`/archive/${debate.id}`} 
                  key={debate.id}
                  className="block border border-terminal-border p-4 rounded hover:bg-gray-900 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-terminal-highlight mb-1">
                        {debate.topic}
                      </h2>
                      <p className="text-sm text-terminal-dimText">
                        Debate #{debate.id.slice(0, 8)} • {debate.totalTurns} turns
                      </p>
                    </div>
                    <div className="text-right text-sm text-terminal-dimText">
                      {debate.completedAt && format(new Date(debate.completedAt), 'yyyy-MM-dd HH:mm')}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {loading && (
            <div className="text-center py-4">
              <p className="animate-pulse">Loading...</p>
            </div>
          )}

          {hasMore && !loading && (
            <div className="text-center mt-8">
              <button
                onClick={() => setPage(prev => prev + 1)}
                className="bg-terminal-border text-terminal-text px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}