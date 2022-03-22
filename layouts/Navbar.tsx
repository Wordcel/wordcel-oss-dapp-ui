import logo from '@/images/logo.svg';
import styles from '@/styles/Navbar.module.scss';
import Image from 'next/image';
import Link from 'next/link';
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

export const StaticNavbar = () => {
  return (
    <div className={styles.staticContainer}>
      <Link href="/">
        <a>
          <div className={styles.maxWidthLogo}>
            <Image alt="Wordcel" src={logo} />
          </div>
        </a>
      </Link>
    </div>
  )
};