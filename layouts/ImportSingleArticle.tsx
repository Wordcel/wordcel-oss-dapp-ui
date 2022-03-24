import styles from '@/styles/Import.module.scss';
import { GetArticleServerSide } from '@/types/props';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { DefaultHead } from './DefaultHead';
import { StaticNavbar } from './Navbar';

export const ImportSingleArticle = (props: GetArticleServerSide) => {
  const { publicKey } = useWallet();
  const router = useRouter();
  useEffect(() => {
    if (!publicKey || publicKey.toString() !== props.user_public_key) {
      router.push('/');
    }
  }, [publicKey, props]);

  return (
    <div>
      <DefaultHead />
      <StaticNavbar />
    </div>
  );
};


