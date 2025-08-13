import type { NextApiRequest, NextApiResponse } from 'next';
import { getArchivedDebates } from '../../../lib/debateService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const page = parseInt(req.query.page as string) || 0;
    const limit = 10;
    const start = page * limit;
    const end = start + limit - 1;
    
    const debates = await getArchivedDebates(start, end);
    res.status(200).json(debates);
  } catch (error) {
    console.error('Error fetching archived debates:', error);
    res.status(500).json({ error: 'Failed to fetch archived debates' });
  }
}