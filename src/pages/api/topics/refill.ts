import type { NextApiRequest, NextApiResponse } from 'next';
import { refillTopicQueue } from '../../../lib/debateService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await refillTopicQueue();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error refilling topic queue:', error);
    res.status(500).json({ error: 'Failed to refill topic queue' });
  }
}