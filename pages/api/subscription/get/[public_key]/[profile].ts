import prisma from '@/lib/prisma';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { public_key, profile } = req.query;
  const subscription = await prisma.subscription.findFirst({
    where: {
      profile_owner: profile as string,
      subscriber: public_key as string,
    }
  });

  if (!subscription) {
    res.status(404).json({
      error: 'Subscription does not exist'
    });
    return;
  }

  res.status(200).json({
    subscription: subscription
  });
};
