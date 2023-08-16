import prisma from '@/lib/prisma'

export const getUserServerSide = async (
  context: any,
  isUsername?: boolean,
  getArticles?: boolean,
  noRedirect?: boolean
) => {
  const ADMIN_PUBLIC_KEY = process.env.NEXT_PUBLIC_ADMIN_PUBLIC_KEY;

  const public_key = context.query.publicKey as string;
  const username = context.query.username as string;
  let user;

    // Check if both public_key and username are null
  if (!public_key && !username) {
    const adminUser = await prisma.user.findFirst({
      where: {
        public_key: ADMIN_PUBLIC_KEY
      }
    });
    user = adminUser;
  } else if (!isUsername) {
    user = await prisma.user.findFirst({ where: { public_key } });
  } else {
    user = await prisma.user.findFirst({ 
      where: {
        username: {
          equals: username,
          mode: 'insensitive'
        }
      }
    });
  }

  if (!user) {
    if (noRedirect) return { props: {} }
    return {
      redirect: {
        permanent: false,
        destination: '/onboarding'
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
  const post_count = await prisma.article.count({
    where: {
      owner: { id: user.id }
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
        post_count
      }
    }
  }
  return {
    props: {
      user: userData
    }
  }
};