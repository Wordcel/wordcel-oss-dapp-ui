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
import { getUserSignature } from '@/lib/signMessage';

type ImportModalProps = {
    close: () => void;
};

export const OnboardingPage = () => {
  const router = useRouter();
  const windowSize = useWindowSize();
  const wallet = useWallet();
  const anchorWallet = useAnchorWallet();

  const [done, setDone] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const publicKey = wallet.publicKey;
  const adminPublicKey = process.env.NEXT_PUBLIC_ADMIN_PUBLIC_KEY;

  useEffect(() => {
    (async function () {
      if (!publicKey || !anchorWallet) return;
      const user_exists = await getUserExists(publicKey.toBase58());
      if (user_exists) {
        router.push('/dashboard');
        return;
      }
      else if (publicKey.toBase58() !== adminPublicKey) {
        router.push('/');
        return;
      }
    })();
  }, [publicKey]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(windowSize.width - 50);
      setHeight(windowSize.height - 50);
    }
  }, []);

  const importArticles = async () => {
      console.log('importing articles');

      if (!wallet.signMessage || !publicKey) return;

      const signature = await getUserSignature(wallet.signMessage, publicKey.toBase58());
      if (!signature) return;

      // Create an input element for file selection
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json'; // Only accept JSON files

      // Listen for the change event (file selection)
      input.onchange = async (event: Event) => {
        // Ensure event.target is an instance of HTMLInputElement
        const target = event.target as HTMLInputElement;

        // Safely access the files property
        const file = target.files ? target.files[0] : null; // Get the selected file

        // Check if a file was selected
        if (file) {
          const reader = new FileReader();

          reader.onload = async (fileEvent: ProgressEvent<FileReader>) => {
            // Ensure event.target is an instance of FileReader
            const fileReaderTarget = fileEvent.target as FileReader;

            try {
              // Safely access the result property and parse the uploaded JSON file
              const jsonData = fileReaderTarget.result ? JSON.parse(fileReaderTarget.result.toString()) : null;

              if (jsonData) {
                // Call the import API with the parsed data
                const response = await fetch('/api/import', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    public_key: publicKey?.toBase58(),
                    signature,
                    data: jsonData
                  })
                });

                const data = await response.json();
                console.log(data);
              }
            } catch (error) {
              console.error('There was an error importing!', error);
            }
          };

          // Read the file contents
          reader.readAsText(file);
        }
      };

      // Programmatically trigger the file input to show the file picker dialog
      input.click();
  };

  function ImportModal({ close }: ImportModalProps) {
      return (
          <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                  <h2>Import your data</h2>
                  <p>By importing, you can quickly set up your profile with existing data. Please have your JSON file exported from wordcel.club</p>

                  <button onClick={() => importArticles()} className={styles.importButton}>Upload JSON file</button>

                  <button onClick={close} className={styles.closeButton}>Close</button>
              </div>
          </div>
      );
  }


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
            <div className={styles.header}>
                <div className={styles.importContainer}>
                    <button onClick={() => setShowModal(true)} className={styles.importButtonBig}>Import your profile</button>
                    <span className={styles.orIndicator}>OR</span>
                </div>
                {showModal && <ImportModal close={() => setShowModal(false)} />}
            </div>

              <OnboardingBox setDone={setDone} />
              {!done && (
                <div className="flex align-items-center justify-content-center">
                  <div>
                    <p className="text size-20 weight-400 gray-400 text-align-center nm mt-4">By creating an account you agree to</p>
                    <Link href="/terms">
                      <a>
                        <p className="text size-20 weight-400 gray-600 text-align-center nm mt-0-5 underline">{"Wordcel's Terms of Service"}</p>
                      </a>
                    </Link>
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
