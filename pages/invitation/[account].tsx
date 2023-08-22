import prisma from '@/lib/prisma';
import { DefaultHead } from '@/components/DefaultHead';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

interface InviteProps {
  name: string;
}

const InviteRedirect = (props: InviteProps) => {
  const router = useRouter();
  const OGImage = 'https://d3ztzybo1ne7w.cloudfront.net/invite/' + props.name;

  useEffect(() => {
    router.push('/onboarding')
  }, [router]);

  return (
    <div className="container-flex">
      <Navbar />
      <DefaultHead
        title={props.name + ' has invited you to the future of publishing.'}
        image={OGImage}
      />
      {/* <Footer /> */}
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