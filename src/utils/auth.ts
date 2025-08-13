import { NextApiRequest, NextApiResponse } from 'next';

// Simple authentication middleware for protected API routes
export function isAuthorized(req: NextApiRequest): boolean {
  const authHeader = req.headers.authorization;
  return authHeader === `Bearer ${process.env.API_SECRET_KEY}`;
}

// Middleware for protecting routes
export function withAuth(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (!isAuthorized(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    return handler(req, res);
  };
}