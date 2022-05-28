import prisma from '@/lib/prisma';

export const getDraftsServerSide = async (context: any) => {
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
  const drafts = await prisma.draft.findMany({
    where: {
      user_id: user.id
    }
  });
  return {
    props: {
      drafts: JSON.parse(JSON.stringify(drafts)),
      user
    }
  }
};
