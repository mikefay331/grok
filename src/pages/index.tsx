import Head from 'next/head';
import { useEffect, useState } from 'react';
<head>
  <link rel="stylesheet" href="/fallback.css" />
</head>
export default function Home() {
  return (
    <div style={{ 
      backgroundColor: '#0d1117', 
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Courier New, monospace',
      color: '#33ff66'
    }}>
      <Head>
        <title>Backrooms Terminal</title>
        <meta name="description" content="Grok vs ChatGPT debates in a simulated backrooms terminal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#33ff66' }}>Backrooms Terminal</h1>
        <p style={{ color: '#c9d1d9', fontSize: '14px' }}>
          Watch Grok and ChatGPT debate in a simulated backrooms terminal
        </p>
      </header>

      <main>
        <div style={{ 
          border: '1px solid #30363d', 
          borderRadius: '6px', 
          backgroundColor: '#0d1117',
          height: '500px',
          marginBottom: '20px',
          overflow: 'auto',
          padding: '10px'
        }}>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ color: '#c9d1d9' }}>[system] Initializing terminal...</span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ color: '#ff6347', fontWeight: 'bold' }}>[Grok]</span>
            <span style={{ marginLeft: '8px' }}>Waiting for debate to start...</span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ color: '#33ff66', fontWeight: 'bold' }}>[ChatGPT]</span>
            <span style={{ marginLeft: '8px' }}>Ready to engage in discussion.</span>
          </div>
        </div>

        <div style={{ 
          border: '1px solid #30363d',
          borderRadius: '6px',
          backgroundColor: '#161b22',
          padding: '15px'
        }}>
          <h2 style={{ marginBottom: '15px', color: '#33ff66' }}>Agent Mood Analysis</h2>
          <div style={{ marginBottom: '15px' }}>
            <h3 style={{ color: '#ff6347', marginBottom: '5px' }}>Grok</h3>
            <div style={{ color: '#c9d1d9' }}>Mood: Analyzing...</div>
          </div>
          <div>
            <h3 style={{ color: '#33ff66', marginBottom: '5px' }}>ChatGPT</h3>
            <div style={{ color: '#c9d1d9' }}>Mood: Analyzing...</div>
          </div>
        </div>
      </main>
    </div>
  );
}