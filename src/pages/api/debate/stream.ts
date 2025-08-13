import { NextApiRequest, NextApiResponse } from 'next';
import { getCurrentDebate } from '../../../lib/debateService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set headers for Server-Sent Events
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');

  // Create a cleanup handler for when the connection closes
  let isConnected = true;
  req.on('close', () => {
    isConnected = false;
    res.end();
  });

  // Immediately send the current state
  try {
    const currentDebate = await getCurrentDebate();
    
    // Send initial state
    res.write(`event: debate-update\ndata: ${JSON.stringify(currentDebate || {})}\n\n`);
    
    // Check for updates every 2 seconds
    const intervalId = setInterval(async () => {
      if (!isConnected) {
        clearInterval(intervalId);
        return;
      }
      
      try {
        const updatedDebate = await getCurrentDebate();
        
        // Send updated state
        res.write(`event: debate-update\ndata: ${JSON.stringify(updatedDebate || {})}\n\n`);
        
        // If the debate is complete, we can stop the interval
        if (updatedDebate?.status === 'complete') {
          clearInterval(intervalId);
          res.end();
        }
      } catch (updateError) {
        console.error('Error getting debate update:', updateError);
        res.write(`event: error-update\ndata: ${JSON.stringify({ message: 'Error fetching debate updates' })}\n\n`);
      }
    }, 2000);
    
  } catch (error) {
    console.error('Error streaming debate:', error);
    res.write(`event: error-update\ndata: ${JSON.stringify({ message: 'Error initializing debate stream' })}\n\n`);
    res.end();
  }
}