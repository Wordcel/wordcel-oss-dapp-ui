import prisma from '@/lib/prisma';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { withSentry } from '@sentry/nextjs';

// Get connection by profile owner
async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { public_key } = req.query;
  const connection = await prisma.connection.findMany({
    where: {
      profile_owner: public_key as string,
    },
    select: {
      connector: true,
      account: true,
    }
  });

  if (!connection) {
    res.status(404).json({
      error: 'Connection does not exist'
    });
    return;
  }

  res.status(200).json({
    connection: connection
  });
};

export default withSentry(handler);