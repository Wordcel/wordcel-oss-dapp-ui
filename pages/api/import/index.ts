import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyMethod, authenticate, verifyKeys } from '@/lib/server';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowed = verifyMethod(req, res, 'POST');
  if (!allowed) return;

  const requiredKeys = ['public_key', 'signature', 'data'];
  const allKeysPresent = verifyKeys(req, res, requiredKeys);
  if (!allKeysPresent) return;

  const {
    public_key,
    signature,
    data
  } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      public_key,
    }
  });

  const authenticated = authenticate(public_key, signature, res);
  if (!authenticated) return;

  try {
    // Check if the provided data has the correct structure
    if (!data.user || !data.drafts || !data.blocks || !data.articles) {
      res.status(400).json({
        error: 'Invalid data format',
      });
      return;
    }
  
  let userId = 1;
  if (user) {
    console.log('User already exists on database');
    // check if the profile hash is the same
    if (user.profile_hash !== data.user.profile_hash) {
      res.status(400).json({
        error: 'User already exists on database with different profile hash. Please delete your account and try again.'
      });
      return;
    } else {
      userId = user.id;
    }
  } else {
    console.log('User does not exist on database, creating new user');
    // Importing user
    const userRes = await prisma.user.create({
      data: {
        public_key: data.user.public_key,
        username: data.user.username,
        name: data.user.name,
        bio: data.user.bio,
        image_url: data.user.image_url,
        twitter: data.user.twitter,
        blog_name: data.user.blog_name,
        profile_hash: data.user.profile_hash,
        discord: data.user.discord,
        banner_url: data.user.banner_url,
        tip_enabled: data.user.tip_enabled,
      }
    });
    userId = userRes.id;
  }

    // Importing drafts
    for (const draft of data.drafts) {
      const draftId = draft.id;
      const draftRes = await prisma.draft.create({
        data: {
          title: draft.title,
          description: draft.description,
          image_url: draft.image_url,
          source: draft.source,
          created_at: new Date(draft.created_at),
          updated_at: draft.updated_at ? new Date(draft.updated_at) : null,
          share_hash: draft.share_hash,
          user_id: userId
        }
      });

      // find the block data for the draft id of the current draft
      const blockData = data.blocks.find((block: { draft_id: any; }) => block.draft_id === draftId);
      console.log(blockData);

      // Importing blocks for draftId
      await prisma.block.create({
        data: {
          data: blockData.data,
          draft_id: draftRes.id
        }
      }) 
    }

    // Importing articles
    for (const article of data.articles) {
      await prisma.article.create({
        data: {
          title: article.title,
          description: article.description,
          image_url: article.image_url,
          views: article.views,
          on_chain: article.on_chain,
          created_at: new Date(article.created_at),
          updated_at: article.updated_at ? new Date(article.updated_at) : null,
          proof_of_post: article.proof_of_post,
          arweave_url: article.arweave_url,
          slug: article.slug,
          show_on_lp: article.show_on_lp,
          user_id: userId
        }
      });
    }

    res.status(200).json({
      success: 'Data imported successfully',
    });

  } catch (e) {
    console.error('Request error', e);
    res.status(500).json({
      error: 'Error importing data',
    });
  }
}

export default handler;
