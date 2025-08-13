import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Header from '@/components/Header';
import { ArchivedDebate } from '@/types';

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

      <div className="flex flex-col min-h-screen bg-black text-gray-300 font-mono">
        <Header archivedCount={debates.length} />
        
        <main className="flex-1 p-4">
          <div className="mb-6">
            <h2 className="text-xl text-green-500 mb-4">Past Debates</h2>
            
            {debates.length === 0 && !loading ? (
              <div className="text-center py-10">
                <p>No archived debates found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {debates.map((debate) => (
                  <Link 
                    href={`/archive/${debate.id}`} 
                    key={debate.id}
                    className="block border border-gray-800 p-4 rounded hover:bg-gray-900 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg text-green-400 mb-1">
                          {debate.topic}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Debate #{debate.id.slice(0, 8)} • {debate.turns.length} turns
                        </p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {debate.completedAt && new Date(debate.completedAt).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-2">
                      <span className="text-xs px-2 py-1 rounded bg-red-900/30 text-red-400">
                        Grok
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-green-900/30 text-green-400">
                        ChatGPT
                      </span>
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
                  className="bg-gray-800 text-green-400 px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}