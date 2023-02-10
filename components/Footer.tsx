import Link from 'next/link';
import logo from '@/images/logo.svg';
import styles from '@/styles/Footer.module.scss';
import TwitterIcon from '@/images/dynamic/Twitter';
import DiscordIcon from '@/images/dynamic/Discord';
import WordcelIcon from '@/images/dynamic/Wordcel';

const socials = [
  { link: 'https://twitter.com/wordcel_club', icon: TwitterIcon },
  { link: 'https://discord.gg/tCswbSK5W2', icon: DiscordIcon },
  { link: "/wordcelclub.sol", icon: WordcelIcon },
];

export const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <div className={styles.heroSection}>
          <div className={styles.logoContainer}>
            <Link href="/">
              <a>
                <img className={styles.logo} src={logo.src} alt="Wordcel" />
              </a>
            </Link>
            <p className="normal-text mt-2 sm">
Wordcel is a solana-native web3 blogging platform that enables writers to publish decentralised, censorship resistant content and get paid for it.            </p>
          </div>
          <div className={styles.socialContainer}>
            <p className="normal-text op-1 bold sm nm">Follow Us</p>
            <div className={styles.socials}>
              {socials.map((social) => (
                <a
                  href={social.link}
                  rel="noopener noreferrer"
                  target="_blank"
                  key={social.link}>
                    {<social.icon color="#1E2833" />}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.bottomSection}>
          <p className="normal-text sm">
            Copyright © {new Date().getFullYear()}. Coffee to Code Technologies Pte Ltd.
            <span className="ml-1">|</span>
            <span>
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="mr-1 ml-1">
                Terms of Service
              </a>
            </span>
            <span>
              {"|"}
              <a className="ml-1" href="https://www.figma.com/file/6EF6Pkbtxzf1Ofe76zevsP/Wordcel-Media-Kit?node-id=0%3A1" target="_blank" rel="noopener noreferrer">
                Media Kit
              </a>
            </span>
          </p>
        </div>
      </div>
    </div>
  )
};
