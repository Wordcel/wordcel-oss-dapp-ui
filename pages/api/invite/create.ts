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
import { withSentry } from '@sentry/nextjs';
import { newInviteAlert } from '@/lib/sendUserActivity';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowed = verifyMethod(req, res, 'POST');
  if (!allowed) return;
  try {
    const requiredKeys = ['account', 'receiver', 'public_key', 'signature'];
    const allKeysPresent = verifyKeys(req, res, requiredKeys);
    if (!allKeysPresent) return;

    const {
      account,
      receiver,
      receiver_name,
      public_key,
      signature
    } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        public_key: public_key
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

    const invite = await prisma.invite.create({
      data: {
        account,
        receiver,
        receiver_name: receiver_name,
        user_id: user.id
      }
    });

    // newInviteAlert(invite);

    res.status(200).json({
      success: true,
      invite: invite
    });

  } catch (e) {
    console.error('Request error', e);
    res.status(500).json({
      error: 'Error creating an invite',
    });
  }
};

export default withSentry(handler);
