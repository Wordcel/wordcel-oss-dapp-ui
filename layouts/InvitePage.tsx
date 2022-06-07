// Style Imports
import styles from '@/styles/Static.module.scss';

// Component Imports
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import {
  getInviteAccount,
  isAdmin,
  sendInvite
} from '@/components/invitationIntegration';
import {
  useAnchorWallet,
  useWallet
} from '@solana/wallet-adapter-react';

// Image imports
import quill from '@/images/elements/quill.svg';

// JSX Imports
import { DefaultHead } from "./DefaultHead";
import { Loading } from './Loading';
import { StaticNavbar } from "./Navbar";
import { ConnectWallet } from './Wallet';
import { Footer } from './Footer';
import { useRouter } from 'next/router';


export const InvitePage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [invitesLeft, setInvitesLeft] = useState(2);
  const [inviteAddress, setInviteAddress] = useState('');

  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();

  useEffect(() => {
    if (publicKey) {
      setLoading(true);
      if (isAdmin(publicKey)) {
        setInvitesLeft(Infinity);
        setLoading(false);
        return;
      }

      // Temporarily disabling new invitations from normal users
      router.push('/');

      // (async function () {
      //   let user_account;
      //   try {
      //     user_account = await getInviteAccount(anchorWallet as any);
      //   } catch {
      //     router.push('/');
      //     return;
      //   }
      //   setInvitesLeft(user_account.invitesLeft);
      //   setLoading(false);
      // })();
    }
  }, [publicKey]);

  const getInviteText = (invitesLeft: number): string => {
    if (invitesLeft === 1) return 'invite';
    return 'invites';
  }

  const handleSendInvite = async () => {
    if (!anchorWallet) return;
    if (invitesLeft === 0) {
      toast('Sorry, you don\'t have any invites left');
      return;
    };
    const invite = await sendInvite(
      anchorWallet as any,
      new PublicKey(inviteAddress)
    );
    if (!invite) return;
    setInvitesLeft(invitesLeft - 1);
  }

  return (
    <div className="container-flex gray">
      <DefaultHead title="Send Invites" />
      <StaticNavbar />
      <div className={styles.container}>
        <div className="main-padding">
          {loading && (
            <Loading width="20rem" height="20rem" />
          )}
          {!loading && (
            <div className="width-100">
              {publicKey && (
                <>
                  <div className={styles.header}>
                    <img src={quill.src} alt="" />
                    <h1 className="heading center nm mt-2">You have {invitesLeft} {getInviteText(invitesLeft)}</h1>
                    <p className="light-sub-heading thin center">You can invite {invitesLeft} more friends to use the DApp</p>
                  </div>
                  <div className={styles.form}>
                    <input
                      onChange={(e) => setInviteAddress(e.target.value)}
                      placeholder='Enter wallet address'
                      className="secondary-input"
                    />
                    <button
                      onClick={handleSendInvite}
                      disabled={inviteAddress.length !== 44}
                      className="secondary-btn mt-2">Send Invite</button>
                  </div>
                </>
              )}
              {!publicKey && (
                <>
                  <div className={styles.header}>
                    <img src={quill.src} alt="" />
                    <h1 className="heading center nm mt-2">Please connect your wallet to continue</h1>
                  </div>
                  <div className={styles.form}>
                    <ConnectWallet>
                      <button className="secondary-btn mt-2">Connect Wallet</button>
                    </ConnectWallet>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
