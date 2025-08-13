import type { NextApiRequest, NextApiResponse } from 'next';
import { startNewDebate } from '../../../lib/debateService';

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
    const debate = await startNewDebate();
    res.status(200).json(debate);
  } catch (error) {
    console.error('Error creating new debate:', error);
    res.status(500).json({ error: 'Failed to create new debate' });
  }
}