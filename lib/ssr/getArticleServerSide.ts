import prisma from '@/lib/prisma';
import { getBlocks } from '@/lib/getArticleBlocks';
import { getPostAccount } from '../contractInteraction';

const redirect = () => {
  return {
    redirect: {
      permanent: false,
      destination: '/'
    },
    props: {}
  }
}

export const getArticleServerSide = async (
  context: any,
  getFromID = false
) => {
  const id = context.query.id;
  const slug = context.query.slug;
  const username = context.query.username;

  let article;
  if (!getFromID) {
    article = await prisma.article.findFirst({
      where: {
        slug,
        owner: {
          username: {
            equals: username,
            mode: 'insensitive'
          }
        }
      }
    });
  } else {
    article = await prisma.article.findFirst({
      where: {
        id
      }
    });
  }

  if (!article) return redirect();
  const user = await prisma.user.findFirst({
    where: {
      id: article.user_id
    }
  });
  if (!user) return redirect();
  const arweave_data = await getBlocks(article.arweave_url, true);
  if (!arweave_data) return redirect();
  const blocks = JSON.stringify(arweave_data.content.blocks);
  if (!blocks) return redirect();

  if (!article.on_chain && article.updated_at) {
    // calculate if it has been 10 mintues since the article was updated
    const now = new Date();
    const updatedAt = new Date(article.updated_at);
    const diff = now.getTime() - updatedAt.getTime();
    const diffMinutes = Math.floor((diff / 1000) / 60);
    if (diffMinutes >= 10) {
      // if 10 minutes has passed, check whether the post account exists on chain
      try {
        const account = await getPostAccount(article.proof_of_post);
        // if the post exists on chain, then update the value on the db of "on_chain" to true
        if (account) {
          const updated = await prisma.article.update({
            where: {
              id: article.id
            },
            data: {
              on_chain: true
            }
          });
          article = updated;
        }
      }
      // if the account doesn't exist, remove the post account from the database
      catch {
        const updated = await prisma.article.update({
          where: {
            id: article.id
          },
          data: {
            proof_of_post: undefined,
            on_chain: false
          }
        });
        article = updated;
      }
    }
  }

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)),
      user_public_key: user.public_key,
      username: user.username,
      blocks,
      user,
      contentDigest: arweave_data.contentDigest,
    }
  }
};
