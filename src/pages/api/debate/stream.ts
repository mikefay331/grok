import type { NextApiRequest, NextApiResponse } from 'next';
import { getCurrentDebate } from '../../../lib/debateService';
import { SSEEvent } from '../../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // For Nginx

  // Send initial state
  const initialState = await getCurrentDebate();
  const initialEvent: SSEEvent = {
    type: 'status',
    payload: initialState || { status: 'idle' }
  };
  
  res.write(`data: ${JSON.stringify(initialEvent)}\n\n`);

  // Keep connection open
  const interval = setInterval(async () => {
    // Send heartbeat
    res.write(`: heartbeat\n\n`);
    
    // Check for debate state updates
    const currentState = await getCurrentDebate();
    if (currentState) {
      const event: SSEEvent = {
        type: 'status',
        payload: currentState
      };
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }
  }, 5000);

  // Handle client disconnect
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
}