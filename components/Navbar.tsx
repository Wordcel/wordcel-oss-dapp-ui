
// Default Imports
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

// Styles
import styles from '@/styles/Navbar.module.scss';

// Images
import logo from '@/images/logo.svg';
import checkIcon from '@/images/icons/check.svg';
import menuIcon from '@/images/icons/menu.svg';
import expandIcon from '@/images/icons/expand.svg';
import linkIcon from '@/images/icons/link.svg';

// import arweaveBadge from '@/images/elements/arweave.svg';
// import pop_image from '@/images/elements/proof-of-post.svg';

// Component Imports
import { useState, useEffect, MutableRefObject } from 'react';
import { Dropdown } from '@nextui-org/react';
import { ConnectWallet } from '@/layouts/Wallet';
import { WHITELIST_URL } from '@/lib/config/constants';
import { useWallet } from '@solana/wallet-adapter-react';
import { useUser } from './Context';
import { getTrimmedPublicKey } from '@/lib/getTrimmedPublicKey';
import { useRouter } from 'next/router';


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
  editProfile,
  shareDraft,
  saveText
}: {
  publish?: () => void;
  proof_of_post?: ProofOfPost;
  editProfile?: EditProfile;
  shareDraft?: () => void;
  saveText?: string;
}) => {

  const data = useUser();
  const router = useRouter();

  const { publicKey, disconnect } = useWallet();
  const showEditProfile = editProfile && data && editProfile.owner === data?.user?.public_key;
  const [buttonOption, setButtonOption] = useState('publish');

  // Todo:
  // 1. Add proof of post icon to open up right sidebar

  const handleDropDownItems = (key: string) => {
    switch (key) {
      case 'profile':
        showEditProfile ? editProfile.edit() : router.push('/' + data?.user?.username)
        break;
      case 'copy':
        if (data?.user) navigator.clipboard.writeText(data.user.public_key);
        break;
      case 'disconnect':
        disconnect();
        break;
    }
  }

  const showShareDraft = shareDraft && buttonOption === 'share';

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
      {publish && data?.user && publicKey && (
        <div className={styles.publishParent}>
          {saveText && (
            <p className="text weight-400 size-16 gray-400 mr-2">{saveText}</p>
          )}
          <button onClick={!showShareDraft ? publish : shareDraft} className={styles.publishBtn}>
            <img src={!showShareDraft ? checkIcon.src : linkIcon.src} alt="" />
            {!showShareDraft ? 'Publish Now' : 'Share Draft'}
          </button>
          {shareDraft && (
            <Dropdown>
              <Dropdown.Trigger>
                <img className={styles.menuIcon} src={menuIcon.src} alt="" />
              </Dropdown.Trigger>
              <div className={styles.dropdownMenu}>
                <Dropdown.Menu onAction={(key) => setButtonOption(key.toString())} aria-label="Publish Actions">
                  <Dropdown.Item key="publish">Publish Now</Dropdown.Item>
                  <Dropdown.Item key="share">Share Draft</Dropdown.Item>
                </Dropdown.Menu>
              </div>
            </Dropdown>
          )}
        </div>
      )}
      {!publicKey && !data?.user && (
        <ConnectWallet noFullSize={true}>
          <p style={{ width: '14rem' }} className="blue-text txt-right pointer">CONNECT WALLET</p>
        </ConnectWallet>
      )}
      {data?.user && (
        <div className={styles.profileParent}>
          <Dropdown>
            <Dropdown.Trigger>
              <div className={styles.profile}>
                <img className={styles.profileIcon} src={
                  data.user.image_url || 'https://avatars.wagmi.bio/' + data.user.username
                } alt="" />
                <p className="text gray-500 size-16 weight-600 ml-2">{data.user.username}</p>
                <p className="text gray-400 size-16 weight-500 ml-1">{getTrimmedPublicKey(data.user.public_key)}</p>
                <img src={expandIcon.src} className={styles.expandIcon} alt="" />
              </div>
            </Dropdown.Trigger>
            <div className={styles.dropdownMenu}>
              <Dropdown.Menu onAction={(key) => handleDropDownItems(key.toString())} aria-label="Profile Actions">
                <Dropdown.Item key="profile">{showEditProfile ? 'Edit Profile' : 'My Profile'}</Dropdown.Item>
                <Dropdown.Item key="copy">Copy Address</Dropdown.Item>
                <Dropdown.Item key="disconnect" withDivider color="error">
                  Disconnect
                </Dropdown.Item>
              </Dropdown.Menu>
            </div>
          </Dropdown>
        </div>
      )}
    </div>
  )
};


export const EditorNavbar = ({
  handlePublish,
  parentShareHash,
  parentSaveText
}: {
  handlePublish: () => void;
  parentShareHash: MutableRefObject<string>;
  parentSaveText: MutableRefObject<string>;
}) => {
  const [saveText, setSaveText] = useState("");
  const [shareHash, setShareHash] = useState("");

  const handleShareDraft = () => {
    if (shareHash) {
      navigator.clipboard.writeText('https://wordcelclub.com/draft/' + shareHash);
      toast.success('Draft link copied to clipboard');
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (parentShareHash.current !== shareHash) setShareHash(parentShareHash.current);
      if (parentSaveText.current !== saveText) setSaveText(parentSaveText.current);
    }, 500)
    return () => {
      clearInterval(interval);
    }
  }, [])

  return (
    <Navbar
      saveText={saveText}
      publish={handlePublish}
      shareDraft={shareHash ? handleShareDraft : undefined}
    />
  )
}