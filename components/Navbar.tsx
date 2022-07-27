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
import { getTrimmedPublicKey } from '@/lib/getTrimmedPublicKey';

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
  const data = useUser();
  console.log(data);

  const { publicKey } = useWallet();
  const showEditProfile = editProfile && data && editProfile.owner === data?.user?.public_key;

  // Todo:
  // 1. Add proof of post icon to open up right sidebar
  // 2. Add edit profile icon to open the edit profile modal

  return (
    <div
      className={`${styles.staticContainer} ${proof_of_post ? styles.hasPop : ''}`}>
      <Link href={data?.user ? '/dashboard' : '/'}>
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
      {!publicKey && !data?.user && (
        <ConnectWallet noFullSize={true}>
          <p className="blue-text txt-right pointer">CONNECT WALLET</p>
        </ConnectWallet>
      )}
      {data?.user && (
        <div className={styles.profile}>
          <img className={styles.profileIcon} src={
            data.user.image_url || 'https://avatars.wagmi.bio/' + data.user.username
          } alt="" />
          <p className="text gray-500 size-16 weight-600 ml-2">{data.user.username}</p>
          <p className="text gray-400 size-16 weight-500 ml-1">{getTrimmedPublicKey(data.user.public_key)}</p>
        </div>
      )}
    </div>
  )
};
