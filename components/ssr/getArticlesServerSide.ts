import prisma from '@/lib/prisma';

export const getArticlesServerSide = async (context: any) => {
  const public_key = context.query.publicKey as string;
  const user = await prisma.user.findFirst({ where: {
    public_key
  }});
  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      },
      props: {}
    }
  };
  const articles = await prisma.article.findMany({
    where: {
      user_id: user.id
    },
    orderBy: {
      created_at: 'desc',
    }
  })
  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)),
      user
    }
  }
}