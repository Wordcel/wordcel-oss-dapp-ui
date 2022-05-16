import prisma from '@/lib/prisma';
import { WHITELIST_URL } from './config/constants';
import { getBlocks } from '@/components/getArticleBlocks';

const redirect = () => {
  return {
    redirect: {
      permanent: false,
      destination: WHITELIST_URL
    },
    props: {}
  }
}

export const getArticleServerSide = async (
  context: any,
  getCache = false
) => {
  const slug = context.query.slug;
  const username = context.query.username;
  const article = await prisma.article.findFirst({
    where: {
      slug,
      owner: {
        username
      }
    }
  });
  if (!article) return redirect();
  const user = await prisma.user.findFirst({
    where: {
      id: article.user_id
    }
  });
  if (!user) return redirect();
  let blocks = '';

  if (getCache && article.cache_link && !article.on_chain) {
    const cached_blocks = await getBlocks(article.cache_link);
    blocks = JSON.stringify(cached_blocks);
  } else if (getCache && article.cache_link && article.on_chain && article.arweave_url) {
    const on_chain_date = new Date(article.on_chain_version);
    const cached_date = new Date(article.cached_at);
    if (on_chain_date > cached_date) {
      const on_chain_blocks = await getBlocks(article.arweave_url);
      blocks = JSON.stringify(on_chain_blocks);
    } else {
      const cached_blocks = await getBlocks(article.cache_link);
      blocks = JSON.stringify(cached_blocks);
    }
  } else if (article.on_chain && article.arweave_url) {
    const on_chain_blocks = await getBlocks(article.arweave_url);
    if (!on_chain_blocks) return redirect();
    blocks = JSON.stringify(on_chain_blocks);
  } else {
    const off_chain_blocks = await prisma.block.findFirst({
      where: {
        article_id: article.id
      }
    });
    if (!off_chain_blocks) return redirect();
    blocks = off_chain_blocks.data;
  }
  if (!blocks) return redirect();

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)),
      user_public_key: user.public_key,
      username: user.username,
      blocks,
      user
    }
  }
}