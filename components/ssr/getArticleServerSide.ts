import prisma from '@/lib/prisma';
import { getBlocks } from '@/components/getArticleBlocks';

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
