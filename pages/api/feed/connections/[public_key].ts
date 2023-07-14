import prisma from '@/lib/prisma';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';

// todo: add pagination
async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { public_key } = req.query;
  const connections = await prisma.connection.findMany({
    where: {
      connector: public_key as string
    }
  });
  const connections_profiles = connections.map((c) => c.profile_owner);
  const articles = await prisma.article.findMany({
    where: {
      owner: {
        public_key: { in: connections_profiles }
      }
    },
    orderBy: {
      created_at: 'desc',
    },
    include: {
      owner: true
    }
  });
  res.status(200).json(articles);
};

export default handler;