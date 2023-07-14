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

    const alreadyExists = await prisma.verifiedTwitter.findFirst({
      where: {
        public_key,
        username
      }
    });

    if (alreadyExists) {
      res.status(200).json({
        success: true,
        message: 'Already verified'
      });
      return;
    }

    const authenticated = authenticate(public_key, signature, res);
    if (!authenticated) return;

    const verified_twitter_id = await verifyTwitterUsername(username, public_key);

    if (typeof verified_twitter_id === 'undefined') {
      res.status(400).json({
        error: 'Tweet not found'
      });
      return;
    }

    const new_twitter_value = await prisma.verifiedTwitter.create({
      data: {
        public_key,
        username,
        twitter_user_id: String(verified_twitter_id)
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

export default handler;