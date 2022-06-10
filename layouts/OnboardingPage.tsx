// Style Imports
import styles from '@/styles/Static.module.scss';


// Layout Imports
import { Footer } from './Footer';
import { DefaultHead } from './DefaultHead';
import { StaticNavbar } from './Navbar';
import { RequestConnect } from '@/elements/RequestConnect';
import { OnboardingBox } from '@/elements/OnboardingBox';

// Component Imports
import toast from 'react-hot-toast';
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { getUserExists } from '@/components/networkRequests';
import { getInviteAccount } from '@/components/invitationIntegration';


export const OnboardingPage = () => {
  const wallet = useAnchorWallet();
  const router = useRouter();
  const windowSize = useWindowSize();
  const { publicKey } = useWallet();
  const [done, setDone] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    (async function () {
      if (!publicKey) return;
      const user_exists = await getUserExists(publicKey.toBase58());
      if (user_exists) {
        router.push('/dashboard/' + publicKey.toBase58() + '/drafts')
        return;
      };
      try {
        await getInviteAccount(wallet as any);
      } catch {
        toast('Sorry, you\'re not whitelisted');
        router.push('/');
      }
    })();
  }, [publicKey]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(windowSize.width);
      setHeight(windowSize.height);
    }
  }, []);

  return (
    <div className='container-flex'>
      <DefaultHead title='Welcome to Wordcel' />
      <StaticNavbar />
      <div className={styles.container}>
        <div className="main-padding">
          {done && (
            <Confetti
              width={width}
              height={height}
            />
          )}
          {publicKey && (
            <div>
              {!done && (
                <div className={styles.header}>
                  <h1 className="subheading lg bold center nm mt-2">Just setting things up.</h1>
                  <p className="light-sub-heading thin center">Welcome to Wordcel, You're only a few steps away from decentralized publishing</p>
                </div>
              )}
              <OnboardingBox setDone={setDone} />
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
};
