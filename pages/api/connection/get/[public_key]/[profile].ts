import prisma from '@/lib/prisma';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { public_key, profile } = req.query;
  const connection = await prisma.connection.findFirst({
    where: {
      profile_owner: profile as string,
      connector: public_key as string,
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

export default handler;