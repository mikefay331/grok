import type { NextApiRequest, NextApiResponse } from 'next';
import { archiveDebate, getCurrentDebate } from '../../../lib/debateService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Server-only endpoint
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.API_SECRET_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const debate = await getCurrentDebate();
    if (!debate) {
      return res.status(404).json({ error: 'No active debate found' });
    }
    
    await archiveDebate(debate);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error archiving debate:', error);
    res.status(500).json({ error: 'Failed to archive debate' });
  }
}