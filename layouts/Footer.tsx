import logo from '@/images/logo.svg';
import styles from '@/styles/Footer.module.scss';
import TwitterIcon from '@/images/dynamic/Twitter';
import DiscordIcon from '@/images/dynamic/Discord';

const socials = [
  { link: 'https://twitter.com/wordcel_club', icon: TwitterIcon },
  { link: 'https://discord.gg/tCswbSK5W2', icon: DiscordIcon },
];

export const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <div className={styles.heroSection}>
          <div className={styles.logoContainer}>
            <img className={styles.logo} src={logo.src} alt="Wordcel" />
            <p className="normal-text mt-2 sm">
              Wordcel enables anyone to publish rich articles on the blockchain that are censorship resistant
            </p>
          </div>
          <div className={styles.socialContainer}>
            <p className="normal-text op-1 bold mt-2 sm nm">Follow Us</p>
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
          <p className="normal-text mt-2 sm txt-left">
            Copyright © {new Date().getFullYear()}. Coffee to Code Technologies Pte Ltd.
          </p>
        </div>
      </div>
    </div>
  )
};
