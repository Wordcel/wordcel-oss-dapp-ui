import prisma from '@/lib/prisma';

const redirect = () => {
  return {
    redirect: {
      permanent: false,
      destination: 'https://tally.so/r/w2d59m'
    },
    props: {}
  }
}

export const getArticleServerSide = async (context: any) => {
  const article_id = Number(context.query.id);
  const article = await prisma.article.findFirst({
    where: {
      id: article_id
    }
  });
  if (!article) return redirect();
  const user = await prisma.user.findFirst({
    where: {
      id: article.user_id
    }
  });
  if (!user) return redirect();
  const blocks = await prisma.block.findFirst({
    where: {
      article_id
    }
  });
  if (!blocks) return redirect();
  return {
    props: {
      article,
      user_public_key: user.public_key,
      blocks: blocks?.data
    }
  }
}