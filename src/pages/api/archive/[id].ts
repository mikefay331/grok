import { NextApiRequest, NextApiResponse } from 'next';
import { getArchivedDebateById } from '../../../lib/debateService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing debate ID' });
  }
  
  try {
    const debate = await getArchivedDebateById(id);
    
    if (!debate) {
      return res.status(404).json({ error: 'Debate not found' });
    }
    
    res.status(200).json(debate);
  } catch (error) {
    console.error(`Error fetching debate ${id}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
}