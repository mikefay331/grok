import { NextApiRequest, NextApiResponse } from 'next';
import { getCurrentDebate, startNewDebate, advanceTurn } from '../../lib/debateService';

// Protect this endpoint with a secret key
const API_SECRET = process.env.API_SECRET_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify the secret key
  const { secret } = req.query;
  if (secret !== API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Get current debate status
    const currentDebate = await getCurrentDebate();
    
    if (!currentDebate || currentDebate.status === 'idle') {
      // No active debate, start a new one
      const newDebate = await startNewDebate();
      return res.status(200).json(newDebate);
    } else if (currentDebate.status === 'streaming') {
      // Advance to the next turn
      const updatedDebate = await advanceTurn();
      return res.status(200).json(updatedDebate);
    } else {
      // Debate is complete, start a new one
      const newDebate = await startNewDebate();
      return res.status(200).json(newDebate);
    }
  } catch (error) {
    console.error('Error in cron job:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}