import prisma from '@/lib/prisma';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { public_key } = req.query;
  const user = await prisma.user.findFirst({
    where: {
      public_key: public_key as string
    }
  });
  if (!user) {
    res.status(404).json({
      error: 'User does not exist'
    });
    return;
  };
  const connection_count = await prisma.connection.count({
    where: { profile_owner: user.public_key }
  });
  res.status(200).json({
    ...user,
    connection_count
  });
};

export default handler;