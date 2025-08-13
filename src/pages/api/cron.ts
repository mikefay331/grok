import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '../../utils/auth';
import { getCurrentDebate, startNewDebate, advanceTurn } from '../../lib/debateService';

// This endpoint is called by the Vercel cron job to advance the debate state
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const currentDebate = await getCurrentDebate();
    
    if (!currentDebate || currentDebate.status === 'idle') {
      // No active debate, start a new one
      const newDebate = await startNewDebate();
      return res.status(200).json(newDebate);
    } else if (currentDebate.status === 'streaming') {
      // Advance the current debate
      const updatedDebate = await advanceTurn();
      return res.status(200).json(updatedDebate);
    } else if (currentDebate.status === 'complete') {
      // If it's been more than 30 seconds since completion, start a new debate
      const completedAt = new Date(currentDebate.completedAt || '');
      const now = new Date();
      const diffSeconds = Math.floor((now.getTime() - completedAt.getTime()) / 1000);
      
      if (diffSeconds > 30) {
        const newDebate = await startNewDebate();
        return res.status(200).json(newDebate);
      }
    }
    
    res.status(200).json(currentDebate);
  } catch (error) {
    console.error('Error in cron job:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default withAuth(handler);