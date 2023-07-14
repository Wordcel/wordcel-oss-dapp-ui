import prisma from '@/lib/prisma';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const exists = await prisma.verifiedTwitter.findFirst({
    where: {
      twitter_user_id: id as string
    }
  });
  if (!exists) {
    res.status(404).json({
      error: 'Twitter user does not exist'
    });
    return;
  };
  res.status(200).json({
    message: 'User has a verified Wordcel account',
    username: exists.username
  });
};

export default handler;