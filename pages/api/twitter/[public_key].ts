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
  const verified = await prisma.verifiedTwitter.findFirst({
    where: {
      public_key: public_key as string
    }
  });
  if (!verified) {
    res.status(404).json({
      error: 'User has not verified their Twitter'
    });
    return;
  };
  res.status(200).json({
    message: 'User has verified their Twitter',
    username: verified.username
  });
};

export default withSentry(handler);