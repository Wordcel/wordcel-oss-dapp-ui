import prisma from '@/lib/prisma';

const redirect = () => {
  return {
    redirect: {
      permanent: false,
      destination: '/'
    },
    props: {}
  }
}

export const getDraftServerSide = async (
  context: any
) => {
  const id = context.query.id;
  const draft = await prisma.draft.findFirst({
    where: {
      id: Number(id)
    }
  });
  if (!draft) return redirect();
  const blocks = await prisma.block.findFirst({
    where: {
      draft: {
        id: draft.id
      }
    }
  });
  const user = await prisma.user.findFirst({
    where: {
      id: draft.user_id
    }
  });
  if (!user) return redirect();

  return {
    props: {
      draft: {
        ...JSON.parse(JSON.stringify(draft)),
        blocks: blocks?.data
      },
      user
    }
  }
}