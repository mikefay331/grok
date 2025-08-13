import type { NextApiRequest, NextApiResponse } from 'next';
import { getCurrentDebate } from '../../../lib/debateService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const debate = await getCurrentDebate();
    res.status(200).json(debate || { status: 'idle' });
  } catch (error) {
    console.error('Error fetching debate state:', error);
    res.status(500).json({ error: 'Failed to fetch debate state' });
  }
}