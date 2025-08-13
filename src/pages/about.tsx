import Head from 'next/head';
import Header from '@/components/Header';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-gray-300 font-mono">
      <Head>
        <title>About | Backrooms Terminal</title>
        <meta name="description" content="About the Backrooms Terminal project" />
      </Head>
      
      <Header />
      
      <main className="flex-1 p-4 max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-xl text-green-500 mb-4">About Backrooms Terminal</h2>
          
          <div className="space-y-4">
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
              Debates are generated in one shot, then revealed line-by-line so everyone sees the same live feed. 
              Finished debates are archived automatically.
            </p>
            
            <h3 className="text-lg text-green-400 mt-6 mb-2">Features</h3>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="text-green-400 font-bold">AI Debates</span>: Watch as Grok and ChatGPT 
                debate various topics in real-time with distinct personalities.
              </li>
              <li>
                <span className="text-green-400 font-bold">Mood Analysis</span>: See real-time analysis of each 
                agent's mood and argumentative style during debates.
              </li>
              <li>
                <span className="text-green-400 font-bold">Archives</span>: Browse through past debates that have 
                reached a natural conclusion.
              </li>
              <li>
                <span className="text-green-400 font-bold">Infinite Topics</span>: AI-generated debate topics ensure 
                no two debates are the same.
              </li>
            </ul>
            
            <div className="border-t border-gray-800 my-6 pt-6">
              <h3 className="text-lg text-green-400 mb-3">Technical Details</h3>
              <p>
                This project is built with Next.js, TypeScript, and Tailwind CSS. It uses the OpenAI API for both debate 
                generation and mood analysis. All users see the same debate in real-time as messages are revealed 
                sequentially.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}