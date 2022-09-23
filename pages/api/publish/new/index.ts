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
import { getHeaderContent } from '@/lib/getHeaderContent';
import { sanitizeHtml } from '@/lib/sanitize';
import { getBlocks } from '@/lib/getArticleBlocks';
import { withSentry } from '@sentry/nextjs';
import slugify from 'slugify';
import { newPostAlert } from '@/lib/sendUserActivity';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowed = verifyMethod(req, res, 'POST');
  if (!allowed) return;
  try {
    const requiredKeys = ['public_key', 'arweave_url', 'signature', 'proof_of_post'];
    const allKeysPresent = verifyKeys(req, res, requiredKeys);
    if (!allKeysPresent) return;

    const {
      public_key,
      arweave_url,
      signature,
      proof_of_post
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

    const blocks = await getBlocks(arweave_url);
    if (!blocks) return;

    const {
      title,
      description,
      image_url,
      slug
    } = getHeaderContent(blocks);

    let mut_slug = slug;

    const already_exists = await prisma.article.findFirst({
      where: {
        slug,
        owner: {
          public_key
        }
      }
    });

    if (already_exists) {
      mut_slug = `${slug}-${Date.now()}`
    }

    mut_slug = mut_slug.substring(0, 128);

    const sanitizedSlug = slugify(mut_slug, {
      lower: true,
      remove: /[*+~.()'"!:@]/g
    });

    const newArticle = await prisma.article.create({
      data: {
        title: sanitizeHtml(title),
        description: sanitizeHtml(description),
        image_url,
        slug: slugify(sanitizedSlug),
        arweave_url,
        proof_of_post,
        on_chain: false,
        updated_at: new Date(),
        owner: {
          connect: {
            id: user.id
          }
        }
      }
    });

    // newPostAlert(newArticle);

    res.status(200).json({
      success: 'Article created',
      article: newArticle,
      username: user.username
    });

  } catch (e) {
    console.error('Request error', e);
    res.status(500).json({
      error: 'Error publishing article',
    });
  }
}

export default withSentry(handler);