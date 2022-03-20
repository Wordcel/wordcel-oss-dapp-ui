import logo from '@/images/logo.svg';
import styles from '@/styles/Navbar.module.scss';
import Image from 'next/image';
import Link from 'next/link';

export const Navbar = () => {
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
        <p className="dark-text">Connect Wallet</p>
      </div>
    </div>
  )
};