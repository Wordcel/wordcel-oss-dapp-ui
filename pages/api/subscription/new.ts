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
    const requiredKeys = ['public_key', 'publication_owner', 'signature', 'account'];
    const allKeysPresent = verifyKeys(req, res, requiredKeys);
    if (!allKeysPresent) return;

    const {
      public_key,
      publication_owner,
      signature,
      account
    } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        public_key,
      }
    });

    if (!user) {
      res.status(400).json({
        error: 'User does not exist'
      });
      return;
    }

    const authenticated = authenticate(public_key, signature, res);
    if (!authenticated) return;

    const exists = await prisma.subscription.findFirst({
      where: {
        publication_owner,
        user_id: user.id,
      }
    })

    if (exists) {
      res.status(400).json({
        error: 'Subscription already exists'
      });
      return;
    }

    const newSubscription = await prisma.subscription.create({
      data: {
        user_id: user.id,
        publication_owner: publication_owner,
        account: account,
      }
    })

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