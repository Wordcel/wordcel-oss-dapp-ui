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
  const drafts = await prisma.draft.findMany({
    where: {
      owner: {
        public_key: public_key as string
      }
    },
    orderBy: {
      created_at: 'desc',
    }
  });
  res.status(200).json(drafts);
};

export default handler;