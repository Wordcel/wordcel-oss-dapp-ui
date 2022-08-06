// Style Imports
import styles from '@/styles/Static.module.scss';

// Image Imports
import pattern from '@/images/elements/pattern.svg';

// Layout Imports
import { Footer } from '../components/Footer';
import { DefaultHead } from '../components/DefaultHead';
import { Navbar } from '../components/Navbar';
import { RequestConnect } from '@/elements/RequestConnect';
import { OnboardingBox } from '@/elements/OnboardingBox';

// Component Imports
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { getUserExists } from '@/lib/networkRequests';
import { getInviteAccount } from '@/lib/invitationIntegration';


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
        router.push('/dashboard');
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
      setWidth(windowSize.width - 50);
      setHeight(windowSize.height - 50);
    }
  }, []);

  return (
    <div className='container-flex'>
      <DefaultHead title='Welcome to Wordcel' />
      <Navbar />
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
                  <h1 className="text gray-700 size-28 weight-700 center nm mt-2">Welcome to Wordcel</h1>
                  <p className="text size-20 weight-400 gray-400 center">{"We're glad to have to onboard. Let's setup your account"}</p>
                </div>
              )}
              <OnboardingBox setDone={setDone} />
              {!done && (
                <div className="flex align-items-center justify-content-center">
                  <div>
                    {/* <p className="text size-20 weight-400 gray-400 text-align-center nm mt-4">By creating an account you agree to</p>
                    <Link href="/terms">
                      <a>
                        <p className="text size-20 weight-400 gray-600 text-align-center nm mt-0-5 underline">{"Wordcel's Terms of Service"}</p>
                      </a>
                    </Link> */}
                    <img className="mt-8" src={pattern.src} alt="" />
                  </div>
                </div>
              )}
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
