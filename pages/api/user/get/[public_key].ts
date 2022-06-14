import prisma from '@/lib/prisma';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { withSentry } from '@sentry/nextjs';

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
  res.status(200).json({
    user
  });
};

export default withSentry(handler);