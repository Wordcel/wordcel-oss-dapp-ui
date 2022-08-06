import prisma from '@/lib/prisma';
import { Draft } from '@prisma/client';

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
  context: any,
  isHash: boolean = false
) => {
  let draft: Draft | null;

  if (isHash) {
    const hash = context.query.hash;
    const draft_ = await prisma.draft.findFirst({
      where: {
        share_hash: hash
      }
    });
    draft = draft_;
  } else {
    const id = context.query.id;
    const draft_ = await prisma.draft.findFirst({
      where: {
        id: Number(id)
      }
    });
    draft = draft_;
  }

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