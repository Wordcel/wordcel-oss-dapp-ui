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
  const invites = await prisma.invite.findMany({
    where: {
      sender: {
        public_key: public_key as string
      }
    }
  });
  res.status(200).json({
    invites: invites
  });
};

export default withSentry(handler);
