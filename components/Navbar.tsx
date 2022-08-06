
// Default Imports
import Link from 'next/link';
import Image from 'next/image';
// import toast from 'react-hot-toast';

// Styles
import styles from '@/styles/Navbar.module.scss';

// Images
import logo from '@/images/logo.svg';
import logoSmall from '@/images/logo-vector.svg';
import checkIcon from '@/images/icons/check.svg';
import menuIcon from '@/images/icons/menu.svg';
import expandIcon from '@/images/icons/expand.svg';
// import linkIcon from '@/images/icons/link.svg';

import arweaveBadge from '@/images/elements/arweave.svg';
import pop_image from '@/images/elements/proof-of-post.svg';
import pop_open_image from '@/images/elements/proof-of-post-open.svg';

// Component Imports
import { useState, useEffect, MutableRefObject } from 'react';
import { Dropdown, Popover } from '@nextui-org/react';
import { ConnectWallet } from '@/components/Wallet';
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
  username: string | undefined;
  written_by: string | undefined;
}

interface EditProfile {
  owner: string | undefined;
  edit: () => void;
}

export const Navbar = ({
  publish,
  proof_of_post,
  editProfile,
  showPreview,
  saveText
}: {
  publish?: () => void;
  proof_of_post?: ProofOfPost;
  editProfile?: EditProfile;
  showPreview?: () => void;
  saveText?: string;
}) => {

  const data = useUser();
  const router = useRouter();

  const { publicKey, disconnect } = useWallet();
  const showEditProfile = editProfile && data && editProfile.owner === data?.user?.public_key;

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

  const handleAdditionalSettings = (key: string) => {
    switch (key) {
      case 'preview':
        if (showPreview) showPreview();
        break;
    }
  }

  return (
    <div className={styles.parent}>
      <div className={styles.filler} />
      <div
        className={`${styles.staticContainer}`}>
        <div className={styles.logoMaxWidth}>
          <Link href={data?.user ? '/dashboard' : '/'}>
            <a>
              <Image alt="Wordcel" src={logo} />
            </a>
          </Link>
        </div>
        <div className={styles.logoSmall}>
          <Link href={data?.user ? '/dashboard' : '/'}>
            <a>
              <Image alt="Wordcel" src={logoSmall} />
            </a>
          </Link>
        </div>
        <div className={styles.additional}>
          {proof_of_post && (
            <Popover>
              <div className={styles.popButtonContainer}>
                <Popover.Trigger>
                  <img className={styles.popButton} src={pop_image.src} alt="" />
                </Popover.Trigger>
              </div>
              <div>
                <Popover.Content>
                  <div className={styles.popContainer}>
                    <div className={styles.popHeader}>
                      {proof_of_post.account && (
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://explorer.solana.com/account/${proof_of_post.account}`}
                        >
                          <img src={pop_open_image.src} alt="" />
                        </a>
                      )}
                      {proof_of_post.arweave_url && (
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={proof_of_post.arweave_url}
                        >
                          <img className={styles.arweaveBadge} src={arweaveBadge.src} alt="" />
                        </a>
                      )}
                    </div>
                    <div className="mt-2" />
                    <p className="nm text size-12 weight-400 gray-400 mt-3">WRITTEN BY</p>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://explorer.solana.com/account/${proof_of_post.written_by}`}
                    >
                      <p className="nm text size-12 weight-400 gray-500 mt-1">{proof_of_post.username}</p>
                    </a>
                  </div>
                </Popover.Content>
              </div>
            </Popover>
          )}
          {publish && data?.user && publicKey && (
            <div className={styles.publishParent}>
              {saveText && (
                <p className="text weight-400 size-16 gray-400 mr-2">{saveText}</p>
              )}
              <button onClick={publish} className={styles.publishBtn}>
                <img src={checkIcon.src} alt="" />
                Publish Now
              </button>
              {showPreview && (
                <Dropdown>
                  <Dropdown.Trigger>
                    <img className={styles.menuIcon} src={menuIcon.src} alt="" />
                  </Dropdown.Trigger>
                  <div className={styles.dropdownMenu}>
                    <Dropdown.Menu onAction={(key) => handleAdditionalSettings(key.toString())} aria-label="Publish Actions">
                      <Dropdown.Item key="preview">Show Preview</Dropdown.Item>
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
                    {data.user.username && (
                      <p className="text gray-500 size-16 weight-600 ml-2">{data.user.username}</p>
                    )}
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
      </div>
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

  const showPreview = () => {
    if (shareHash) window.open(`/draft/${shareHash}`, '_blank');
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
      showPreview={shareHash ? showPreview : undefined}
    />
  )
}