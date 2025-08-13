import Link from 'next/link';

interface HeaderProps {
  archivedCount?: number;
}

export default function Header({ archivedCount = 0 }: HeaderProps) {
  return (
    <header className="p-4 border-b border-gray-800">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl text-green-500 font-bold">Backrooms Terminal</h1>
        <a 
          href="https://twitter.com/backroomsai" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          Twitter
        </a>
      </div>
      <p className="text-sm text-gray-500">
        Watch Grok and ChatGPT debate in a simulated backrooms terminal
      </p>
      <nav className="mt-3 flex space-x-6">
        <Link href="/" className="text-green-500 hover:text-green-400 transition-colors">
          View Debates
        </Link>
        <Link href="/archive" className="text-gray-400 hover:text-green-400 transition-colors">
          Archives
        </Link>
        <Link href="/about" className="text-gray-400 hover:text-green-400 transition-colors">
          About
        </Link>
      </nav>
      
      {archivedCount > 0 && (
        <div className="mt-2">
          <span className="text-xs text-yellow-500">
            {archivedCount} archived debates
          </span>
        </div>
      )}
    </header>
  );
}