import prisma from '@/lib/prisma';
import { DefaultHead } from '@/layouts/DefaultHead';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { StaticNavbar } from '@/layouts/Navbar';
import { Footer } from '@/layouts/Footer';

interface InviteProps {
  name: string;
}

const InviteRedirect = (props: InviteProps) => {
  const router = useRouter();
  const OGImage = 'https://i0.wp.com/og.up.railway.app/invite/' + props.name;
  useEffect(() => {
    router.push('/onboarding')
  }, [])
  return (
    <div className="container-flex">
      <StaticNavbar />
      <DefaultHead
        title={props.name + ' has invited you to the future of publishing.'}
        image={OGImage}
      />
      <Footer />
    </div>
  );
};

export default InviteRedirect;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = {
    props: {
      name: '',
    },
    redirect: {
      destination: '/',
    }
  };
  const account = context.query.account;
  const invite = await prisma.invite.findFirst({
    where: {
      account: account as string
    }
  });
  if (!invite) return redirect;
  const user = await prisma.user.findFirst({
    where: { id: invite.user_id }
  });
  if (!user) return redirect;
  return {
    props: {
      name: user.name
    }
  }
}