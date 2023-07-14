import prisma from '@/lib/prisma';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import {
  verifyKeys,
  verifyMethod
} from '@/lib/server';
import { getTipDestination } from '@/lib/networkRequests';
import { User } from '@prisma/client';
import { newTipAlert } from '@/lib/sendUserActivity';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowed = verifyMethod(req, res, 'POST');
  if (!allowed) return;
  try {
    const requiredKeys = ['public_key', 'txid', 'to_user'];
    const allKeysPresent = verifyKeys(req, res, requiredKeys);
    if (!allKeysPresent) return;

    const {
      public_key,
      txid,
      to_user
    } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        public_key: to_user
      }
    });

    if (!user) {
      res.status(400).json({
        error: 'User does not exist'
      });
      return;
    };

    const already_exists = await prisma.tip.findFirst({
      where: {
        txid: txid
      }
    });

    if (already_exists) {
      res.status(400).json({
        error: 'Tip already added to database'
      });
      return;
    };

    const receiver = await getTipDestination(txid);

    if (receiver !== user.public_key) {
      res.status(400).json({
        error: 'Tip is not to the profile'
      });
      return;
    }

    const new_tip = prisma.tip.create({
      data: {
        from: public_key,
        txid: txid,
        user_id: user.id,
        created_at: new Date()
      }
    });

    let from_user: string|User = '';

    const from_user_profile = await prisma.user.findFirst({
      where: {
        public_key: public_key
      }
    });

    if (!from_user_profile) {
      from_user = public_key
    } else {
      from_user = from_user_profile
    }

    newTipAlert(from_user, user);

    res.status(200).json(new_tip);

  } catch (e) {
    console.error('Request error', e);
    res.status(500).json({
      error: 'Error creating new profile',
    });
  }
}

export default handler;