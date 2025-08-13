import { NextApiRequest, NextApiResponse } from 'next';
import { getArchivedDebates } from '../../../lib/debateService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const page = parseInt(req.query.page as string) || 0;
  const pageSize = 10;
  
  try {
    const start = page * pageSize;
    const end = start + pageSize - 1;
    
    const archivedDebates = await getArchivedDebates(start, end);
    
    res.status(200).json(archivedDebates);
  } catch (error) {
    console.error('Error fetching archived debates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}