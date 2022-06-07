// Style Imports
import styles from '@/styles/Static.module.scss';


// Layout Imports
import { Footer } from './Footer';
import { DefaultHead } from './DefaultHead';
import { StaticNavbar } from './Navbar';
import { RequestConnect } from '@/elements/RequestConnect';
import { OnboardingBox } from '@/elements/OnboardingBox';

// Component Imports
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useWallet } from '@solana/wallet-adapter-react';
import { getUserExists } from '@/components/networkRequests';


export const OnboardingPage = () => {
  const router = useRouter();
  const { publicKey } = useWallet();

  useEffect(() => {
    (async function () {
      if (!publicKey) return;
      const user_exists = await getUserExists(publicKey.toBase58());
      if (user_exists) router.push('/dashboard/' + publicKey.toBase58() + '/drafts');
    })();
  }, [publicKey]);

  return (
    <div className='container-flex'>
      <DefaultHead title='Welcome to Wordcel' />
      <StaticNavbar />
      <div className={styles.container}>
        <div className="main-padding">
          {publicKey && (
            <div>
              <div className={styles.header}>
                <h1 className="subheading lg bold center nm mt-2">Just setting things up.</h1>
                <p className="light-sub-heading thin center">Welcome to Wordcel, You're only a few steps away from decentralized publishing</p>
              </div>
              <OnboardingBox />
            </div>
          )}
          {!publicKey && (
            <RequestConnect />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}