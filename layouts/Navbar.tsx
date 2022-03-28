import logo from '@/images/logo.svg';
import styles from '@/styles/Navbar.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import publishButton from '@/images/elements/publish.svg';
import { useState } from 'react';
import { ConnectWallet } from './Wallet';

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

export const StaticNavbar = ({
  publish
}: {
  publish?: () => void;
}) => {
  return (
    <div
      style={{ justifyContent: publish ? 'space-between' : 'center' }}
      className={styles.staticContainer}>
      <Link href="/">
        <a>
          <div className={styles.maxWidthLogo}>
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
    </div>
  )
};