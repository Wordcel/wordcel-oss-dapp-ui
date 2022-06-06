// Style Imports
import styles from '@/styles/Invite.module.scss';

// Component Imports
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { sendInvite } from '@/components/invitationIntegration';
import { PublicKey } from '@solana/web3.js';
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


export const InvitePage = () => {
  const [clicked, setClicked] = useState(0);
  const [loading, setLoading] = useState(true);
  const [invitesLeft, setInvitesLeft] = useState(2);
  const [inviteAddress, setInviteAddress] = useState('');

  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const getInviteText = (invitesLeft: number): string => {
    if (invitesLeft === 1) return 'invite';
    return 'invites';
  }

  useEffect(() => {
    (async function () {
      if (!anchorWallet || clicked === 0) return;
      if (invitesLeft === 0) {
        toast('Sorry, you don\'t have any invites left');
        return;
      };
      const invite = await sendInvite(
        anchorWallet as any,
        new PublicKey(inviteAddress)
      );
      // Todo: save this invite address to the db
    })();
  }, [publicKey, clicked]);

  return (
    <div className="container-flex">
      <DefaultHead title="Send Invites" />
      <StaticNavbar />
      <div className={styles.container}>
        <div className="main-padding">
          {loading && (
            <Loading width="20rem" height="20rem" />
          )}
          {!loading && (
            <div className="width-100">
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
                <ConnectWallet>
                  <button
                    onClick={() => setClicked(clicked + 1)}
                    disabled={inviteAddress.length !== 44}
                    className="secondary-btn mt-2">{publicKey ? 'Send Invite' : 'Connect Wallet'}</button>
                </ConnectWallet>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
