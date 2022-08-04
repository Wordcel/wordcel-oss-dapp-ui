import crypto from 'crypto';
import prisma from '@/lib/prisma';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import {
  verifyKeys,
  verifyMethod
} from '@/lib/server';
import { getHeaderContent } from '@/lib/getHeaderContent';
import { sanitizeHtml } from '@/lib/sanitize';
import { withSentry } from '@sentry/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowed = verifyMethod(req, res, 'POST');
  if (!allowed) return;
  try {
    const requiredKeys = ['twitter_user_id', 'authorization_token', 'blocks'];
    const allKeysPresent = verifyKeys(req, res, requiredKeys);
    if (!allKeysPresent) return;

    const {
      authorization_token,
      twitter_user_id,
      blocks
    } = req.body;

    if (authorization_token !== process.env.IMPORT_AUTHORIZATION) {
      res.status(400).json({
        error: 'Invalid authorization token'
      });
      return;
    }

    const user_twitter = await prisma.verifiedTwitter.findFirst({
      where: {
        twitter_user_id
      }
    });

    if (!user_twitter) {
      res.status(400).json({
        error: 'Twiiter User ID does not exist on database'
      });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        public_key: user_twitter.public_key
      }
    });

    if (!user) {
      res.status(400).json({
        error: 'User does not exist'
      });
      return;
    }

    const {
      title,
      description,
      image_url
    } = getHeaderContent(blocks);

    const randomBytes = crypto.randomBytes(32).toString('hex');

    const newDraft = await prisma.draft.create({
      data: {
        title: sanitizeHtml(title),
        description: sanitizeHtml(description),
        image_url,
        updated_at: new Date(),
        share_hash: randomBytes,
        owner: {
          connect: {
            id: user.id
          }
        }
      }
    });

    await prisma.block.create({
      data: {
        data: JSON.stringify(blocks),
        draft_id: newDraft.id
      }
    });

    res.status(200).json({
      success: 'Draft Imported',
      draft: newDraft
    });

  } catch (e) {
    console.error('Request error', e);
    res.status(500).json({
      error: 'Error updating/creating draft',
    });
  }
}

export default withSentry(handler);