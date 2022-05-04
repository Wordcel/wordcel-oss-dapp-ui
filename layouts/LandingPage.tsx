import { useState } from 'react';
import { ConnectWallet } from './Wallet';
import { DefaultHead } from './DefaultHead';
import { Navbar } from './Navbar';
import Image from 'next/image';
import quillIcon from '@/images/icons/quill.svg';
import styles from '@/styles/Home.module.scss';
import editorPreview from '@/images/elements/editor.svg'
import editorGradient from '@/images/elements/editor-gradient.png';
import censorship from '@/images/details/censorship.svg';
import decentralized from '@/images/details/decentralized.svg';
import openSourced from '@/images/details/open-sourced.svg';
import { Footer } from './Footer';

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
  const [clicked, setClicked] = useState(false);
  return (
    <div className="container-flex">
      <DefaultHead />
      <div className={styles.heroGradient}>
        <Navbar />
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
              <ConnectWallet
                noToast={true}
                redirectToWelcome={clicked}>
                <button
                  style={{ maxWidth: '26.5rem' }}
                  className="main-btn"
                  onClick={() => setClicked(true)}>
                  Connect Wallet
                </button>
              </ConnectWallet>
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
