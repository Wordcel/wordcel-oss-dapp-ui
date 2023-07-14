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
  const invites = await prisma.invite.findMany({
    where: {
      sender: {
        public_key: public_key as string
      }
    },
    orderBy: {
      created_at: 'desc',
    },
    take: 5
  });
  res.status(200).json({
    invites: JSON.parse(JSON.stringify(invites)),
  });
};

export default handler;
