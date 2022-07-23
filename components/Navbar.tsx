import Link from 'next/link';
import Image from 'next/image';
import logo from '@/images/logo.svg';
import styles from '@/styles/Navbar.module.scss';
import publishButton from '@/images/elements/publish.svg';
import editButton from '@/images/elements/edit-profile.svg';
import arweaveBadge from '@/images/elements/arweave.svg';
import pop_image from '@/images/elements/proof-of-post.svg';
import { ConnectWallet } from '@/layouts/Wallet';
import { CLUSTER, WHITELIST_URL } from '@/lib/config/constants';
import { useWallet } from '@solana/wallet-adapter-react';
import { useUser } from './Context';

export const LandingNavbar = ({
  whitelisted,
  clicked,
  setClicked
}: {
  whitelisted: boolean | null;
  clicked: number;
  setClicked(clicked: number): void;
}) => {
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
        <ConnectWallet noFullSize={true} noToast={true}>
          <p onClick={() => {
            setClicked(clicked + 1);
            if (whitelisted === false) {
              window.open(WHITELIST_URL, '_blank');
            }
          }} className="dark-text pointer">
            {whitelisted === null ? 'Connect Wallet' : ''}
            {whitelisted === false ? 'Request Access' : ''}
            {whitelisted === true ? 'Dashboard' : ''}
          </p>
        </ConnectWallet>
      </div>
    </div>
  );
};

interface ProofOfPost {
  arweave_url: string | undefined;
  account: string | undefined;
}

interface EditProfile {
  owner: string | undefined;
  edit: () => void;
}

export const Navbar = ({
  publish,
  proof_of_post,
  editProfile
}: {
  publish?: () => void;
  proof_of_post?: ProofOfPost;
  editProfile?: EditProfile;
}) => {
  const { publicKey } = useWallet();
  const showEditProfile = editProfile && publicKey && editProfile.owner === publicKey.toBase58();
  const spaceBetweenContent = publish || proof_of_post || ((editProfile && !publicKey) || showEditProfile);

  const data = useUser();
  console.log(data);

  return (
    <div
      style={{ justifyContent: spaceBetweenContent ? 'space-between' : 'center' }}
      className={`${styles.staticContainer} ${proof_of_post ? styles.hasPop : ''}`}>
      <Link href={publicKey ? '/dashboard' : '/'}>
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
            href={`https://explorer.solana.com/account/${proof_of_post.account}?cluster=${CLUSTER}`}
            target="_blank"
            rel="noopener noreferrer">
              <img
                className={styles.popBadge}
                src={pop_image.src}
                alt="Proof of Post"
              />
          </a>
          <a href={proof_of_post.arweave_url} target="_blank" rel="noopener noreferrer">
            <img
              className={styles.arweaveBadge}
              src={arweaveBadge.src} alt="Arweave Badge" />
          </a>
        </div>
      )}
      {editProfile && !publicKey && (
        <ConnectWallet>
          <p className="blue-text txt-right pointer">CONNECT WALLET</p>
        </ConnectWallet>
      )}
      {showEditProfile && (
        <div
          onClick={editProfile.edit}
          className="pointer">
          <Image src={editButton} alt="Edit Profile" />
        </div>
      )}
    </div>
  )
};
