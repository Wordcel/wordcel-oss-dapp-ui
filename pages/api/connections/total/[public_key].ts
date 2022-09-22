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
  const connection = await prisma.connection.count({
    where: {
      profile_owner: public_key as string,
    }
  });

  if (!connection) {
    res.status(404).json({
      error: 'Connection does not exist'
    });
    return;
  }

  res.status(200).json({
    total_connections: connection
  });
};

export default withSentry(handler);