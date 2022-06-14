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
import { verifyTwitterUsername } from '@/lib/verifyTwitter';
import { withSentry } from '@sentry/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowed = verifyMethod(req, res, 'POST');
  if (!allowed) return;
  try {
    const requiredKeys = ['public_key', 'username', 'signature'];
    const allKeysPresent = verifyKeys(req, res, requiredKeys);
    if (!allKeysPresent) return;

    const {
      public_key,
      username,
      signature
    } = req.body;

    const authenticated = authenticate(public_key, signature, res);
    if (!authenticated) return;

    const twitter_verified = await verifyTwitterUsername(username, public_key);
    if (!twitter_verified) {
      res.status(400).json({
        error: 'Tweet not found'
      });
      return;
    }

    const new_twitter_value = await prisma.verifiedTwitter.create({
      data: {
        public_key,
        username,
      }
    });

    res.status(200).json({
      success: true,
      data: new_twitter_value
    });

  }
  catch (e) {
    console.error('Request error', e);
    res.status(500).json({
      error: 'Error verifying Twitter username',
    });
  }
}

export default withSentry(handler);