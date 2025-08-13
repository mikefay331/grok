import type { NextApiRequest, NextApiResponse } from 'next';
import { advanceTurn, getCurrentDebate, startNewDebate } from '../../../lib/debateService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Server-only endpoint for cron/worker
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.API_SECRET_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
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
      // Wait period after completion (implement cooldown in cron job)
      return res.status(200).json(currentDebate);
    }
    
    res.status(200).json(currentDebate);
  } catch (error) {
    console.error('Error advancing debate:', error);
    res.status(500).json({ error: 'Failed to advance debate' });
  }
}