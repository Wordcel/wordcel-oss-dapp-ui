import prisma from '@/lib/prisma';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { withSentry } from '@sentry/nextjs';

// Get total connections by profile owner
async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { public_key } = req.query;
  const connections = await prisma.connection.count({
    where: {
      profile_owner: public_key as string,
    }
  });
  res.status(200).json({
    total_connections: connections
  });
};

export default withSentry(handler);