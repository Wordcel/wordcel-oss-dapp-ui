import Link from 'next/link';
import Image from 'next/image';
import logo from '@/images/logo.svg';
import styles from '@/styles/Navbar.module.scss';
import publishButton from '@/images/elements/publish.svg';
import arweaveBadge from '@/images/elements/arweave.svg';
import { useState } from 'react';
import { ConnectWallet } from '@/layouts/Wallet';
import { CLUSTER } from '@/components/config/constants';

export const Navbar = () => {
  const [clicked, setClicked] = useState(false);
  return (
    <div className={styles.landingContainer}>
      <Link href="/">
        <a>
          <div className={styles.maxWidthLogo}>
            <Image alt="Wordcel" src={logo} />
          </div>
        </a>
      </Link>
      <div className={styles.landingConnect}>
        <div className={styles.connectVector} />
        <ConnectWallet
          noFullSize={true}
          noToast={true}
          redirectToWelcome={clicked}>
          <p
            onClick={() => setClicked(true)}
            className="dark-text pointer">Connect Wallet</p>
        </ConnectWallet>
      </div>
    </div>
  );
};

interface ProofOfPost {
  arweave_url: string | undefined;
  account: string | undefined;
}

export const StaticNavbar = ({
  publish,
  proof_of_post
}: {
  publish?: () => void;
  proof_of_post?: ProofOfPost;
}) => {
  return (
    <div
      style={{ justifyContent: (publish || proof_of_post) ? 'space-between' : 'center' }}
      className={styles.staticContainer}>
      <Link href="/">
        <a>
          <div className={styles.logoMaxWidth}>
            <Image alt="Wordcel" src={logo} />
          </div>
        </a>
      </Link>
      {publish && (
        <div
          onClick={publish}
          className="pointer">
          <Image src={publishButton} alt="Publish"/>
        </div>
      )}
      {proof_of_post?.arweave_url && (
        <div className={styles.proofOfPost}>
          <a
            href={`https://solscan.io/account/${proof_of_post.account}?cluster=${CLUSTER}`}
            target="_blank"
            rel="noopener noreferrer">
              <button className="main-btn sm pop">Proof of Post</button>
          </a>
          <a href={proof_of_post.arweave_url} target="_blank" rel="noopener noreferrer">
            <img
              className={styles.arweaveBadge}
              src={arweaveBadge.src} alt="Arweave Badge" />
          </a>
        </div>
      )}
    </div>
  )
};