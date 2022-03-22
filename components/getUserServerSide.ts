import prisma from '@/lib/prisma'

export const getUserServerSide = async (context: any) => {
  const public_key = context.query.publicKey as string;
  const user = await prisma.user.findFirst({ where: {
    public_key
  }});
  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: 'https://tally.so/r/w2d59m'
      },
      props: {}
    }
  };
  return {
    props: {
      user
    }
  }
};