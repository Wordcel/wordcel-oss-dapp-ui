import prisma from '@/lib/prisma'

export const getUserServerSide = async (
  context: any,
  isUsername?: boolean,
  getArticles?: boolean,
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
      username: {
        equals: username,
        mode: 'insensitive'
      }
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
  const connection_count = await prisma.connection.count({
    where: { profile_owner: user.public_key }
  });
  const invited_by_inv = await prisma.invite.findFirst({
    where: {
      receiver: user.public_key
    }
  });
  let invited_by;
  if (invited_by_inv) {
    invited_by = await prisma.user.findFirst({
      where: {
        id: invited_by_inv?.user_id
      }
    });
  }
  const userData = {
    ...user,
    connection_count,
    invited_by: invited_by ? {
      name: invited_by.name,
      username: invited_by.username,
    } : null
  };
  if (getArticles) {
    const articles = await prisma.article.findMany({
      take: 10,
      where: {
        owner: { id: user.id }
      },
      orderBy: {
        created_at: 'desc',
      }
    });
    return {
      props: {
        user: userData,
        articles: JSON.parse(JSON.stringify(articles)),
        post_count: articles.length
      }
    }
  }
  return {
    props: {
      user: userData
    }
  }
};