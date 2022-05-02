import Image from 'next/image';
import styles from '@/styles/Welcome.module.scss';
import verifiedElement from '@/images/elements/verified.svg';
import importGradient from '@/images/elements/welcome-gradient.png'
import { StaticNavbar } from "../layouts/Navbar";
import { DefaultHead } from "../layouts/DefaultHead";
import { GetUserServerSide } from '@/types/props';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useWallet } from '@solana/wallet-adapter-react';

export const WelcomePage = ({ user }: GetUserServerSide) => {
  const firstName = user?.name.split(' ')[0] || '';
  const blog_name = user?.blog_name || '';
  const router = useRouter();
  const { publicKey } = useWallet();

  useEffect(() => {
    if (!publicKey || publicKey.toString() !== router.query.publicKey) {
      router.push('/')
    }
  }, [publicKey, router]);

  return (
    <div>
      <DefaultHead />
      <StaticNavbar />
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.verified}>
            <Image src={verifiedElement} alt="" />
          </div>
          <h1 className="heading center">Welcome to Wordcel <br />{firstName}</h1>
          <p
            style={{
              maxWidth: '45rem',
              textAlign: 'center',
              marginTop: '0rem'
            }}
            className="normal-text">Wordcel enables anyone to publish
            rich articles on the blockchain that are censorship resistant
          </p>
          <div className={styles.importBox}>
            <div className={styles.importGradient}>
              <Image alt="" src={importGradient} />
            </div>
            <p className="subheading nm">Import articles</p>
            <p
              style={{ marginTop: '1rem' }}
              className="subheading nm light">Import articles from {blog_name}?</p>
            <button
              onClick={() => router.push(`/import/${user?.public_key}`)}
              style={{ marginTop: '2.8rem' }}
              className="main-btn">Import Articles</button>
          </div>
        </div>
      </div>
    </div>
  )
};
