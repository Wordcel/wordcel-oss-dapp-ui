import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { ConnectWallet } from './Wallet';
import { DefaultHead } from '../components/DefaultHead';
import { LandingNavbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { getIfWhitelisted } from '@/lib/getIfUserIsWhitelisted';
import { useRouter } from 'next/router';
import { WHITELIST_URL } from '@/lib/config/constants';
import Image from 'next/image';
import quillIcon from '@/images/icons/quill.svg';
import styles from '@/styles/Home.module.scss';
import editorPreview from '@/images/elements/editor.svg'
import editorGradient from '@/images/elements/editor-gradient.png';
import noWL from '@/images/elements/noWL.svg';
import censorship from '@/images/details/censorship.svg';
import decentralized from '@/images/details/decentralized.svg';
import openSourced from '@/images/details/open-sourced.svg';

const details = [
  {
    icon: decentralized,
    title: 'Decentralized',
    description: 'All content on Wordcel is stored permanently, powered by the Arweave network'
  },
  {
    icon: openSourced,
    title: 'Open Sourced',
    description: 'Wordcel will be open-sourced soon for contributions on GitHub'
  },
  {
    icon: censorship,
    title: 'Censorship Free',
    description: 'Wordcel is censorship resistant and can be used by anyone'
  }
];

export const LandingPage = () => {
  const router = useRouter();
  const wallet = useAnchorWallet();

  const { publicKey } = useWallet();
  const [clicked, setClicked] = useState(0);
  const [whitelisted, setWhitelisted] = useState<null | boolean>(null);

  useEffect(() => {
    (async function () {
      if (!publicKey) return;
      if (whitelisted && clicked !== 0) {
        router.push(`/dashboard/${publicKey.toBase58()}/published`)
        return;
      }
      toast.loading('Loading')
      const fWhitelisted = await getIfWhitelisted(
        wallet as any,
        router
      );
      console.log(fWhitelisted)
      toast.dismiss();
      setWhitelisted(fWhitelisted);
    })();
  }, [clicked, publicKey])

  return (
    <div className="container-flex">
      <DefaultHead />
      <div className={styles.heroGradient}>
        <LandingNavbar
          whitelisted={whitelisted}
          clicked={clicked}
          setClicked={setClicked}
        />
        <div className={styles.sectionOne}>
          <div className={styles.sectionOneImage}>
            <Image alt="" src={editorPreview} />
            <div className={styles.editorGradient}>
              <Image alt="" src={editorGradient} />
            </div>
          </div>
          <div className={styles.sectionOneContent}>
            <Image src={quillIcon} alt="" />
            <h1
              style={{ marginBottom: '0rem' }}
              className="heading">Decentralised Publishing for Web3</h1>
            <p
              style={{ marginBottom: '2.4rem' }}
              className="normal-text">Wordcel enables anyone to publish
              rich articles on the blockchain that are censorship resistant
            </p>
            {whitelisted === false && (
              <div className={styles.noWL}>
                <img className={styles.noWLImage} src={noWL.src} alt="" />
                <a
                  href={WHITELIST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blue-text lg dark ml-2 pointer"
                >REQUEST ACCESS</a>
              </div>
            )}
            {(whitelisted === true || whitelisted === null) && (
              <ConnectWallet noToast={true}>
                <button
                  style={{ maxWidth: '26.5rem' }}
                  className="main-btn"
                  onClick={() => setClicked(clicked + 1)}>
                  {whitelisted === true ? 'Go to Dashboard' : 'Connect Wallet'}
                </button>
              </ConnectWallet>
            )}
          </div>
        </div>
        <div className={styles.detailsContainer}>
          {details.map((detail) => (
            <div className={styles.detailBox} key={detail['title']}>
              <div style={{ width: '5rem' }}>
                <img src={detail.icon.src} alt="" />
              </div>
              <div className={styles.detailContent}>
                <p
                  style={{ margin: '0rem' }}
                  className="dark-text lg">{detail.title}</p>
                <p
                  style={{ margin: '0rem', marginTop: '1rem' }}
                  className="normal-text sm">{detail.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
};
