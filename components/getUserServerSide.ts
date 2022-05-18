import prisma from '@/lib/prisma'

export const getUserServerSide = async (
  context: any,
  isUsername?: boolean,
  articles?: boolean,
  noRedirect?: boolean
) => {
  const public_key = context.query.publicKey as string;
  const username = context.query.username as string;
  let user;
  if (!isUsername) {
    const user_ = await prisma.user.findFirst({ where: {
      public_key
    }});
    user = user_;
  } else {
    const user_ = await prisma.user.findFirst({ where: {
      username
    }});
    user = user_;
  }
  if (!user) {
    if (noRedirect) return { props: {} }
    return {
      redirect: {
        permanent: false,
        destination: '/'
      },
      props: {}
    }
  };
  if (articles) {
    const articles = await prisma.article.findMany({
      where: {
        owner: { id: user.id }
      }
    });
    return {
      props: {
        user,
        articles: JSON.parse(JSON.stringify(articles))
      }
    }
  }
  return {
    props: {
      user
    }
  }
};