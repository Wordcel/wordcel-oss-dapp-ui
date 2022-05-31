import prisma from '@/lib/prisma';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import {
  verifyKeys,
  verifyMethod,
  authenticate
} from '@/lib/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowed = verifyMethod(req, res, 'POST');
  if (!allowed) return;
  try {
    const requiredKeys = ['public_key', 'profile_owner', 'signature', 'account'];
    const allKeysPresent = verifyKeys(req, res, requiredKeys);
    if (!allKeysPresent) return;

    const {
      public_key,
      profile_owner,
      signature,
      account
    } = req.body;

    const authenticated = authenticate(public_key, signature, res);
    if (!authenticated) return;

    const exists = await prisma.subscription.findFirst({
      where: {
        profile_owner,
        subscriber: public_key
      }
    });

    if (exists) {
      res.status(400).json({
        error: 'Subscription already exists'
      });
      return;
    };

    const newSubscription = await prisma.subscription.create({
      data: {
        profile_owner: profile_owner,
        account: account,
        subscriber: public_key
      }
    });

    res.status(200).json({
      success: 'Subscription created',
      subscription: newSubscription
    });

  } catch (e) {
    console.error('Request error', e);
    res.status(500).json({
      error: 'Error creating subscription',
    });
  }
}