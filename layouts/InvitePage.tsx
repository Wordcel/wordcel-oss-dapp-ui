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
import { Footer } from './Footer';
import { useRouter } from 'next/router';
import { RequestConnect } from '@/elements/RequestConnect';
import { createNewInvite } from '@/components/networkRequests';
import { getUserSignature } from '@/lib/signMessage';
import { getTrimmedPublicKey } from '@/lib/getTrimmedPublicKey';
import { getDomainOwner } from '@/lib/verifySolDomain';


export const InvitePage = () => {
  const router = useRouter();

  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [invitesLeft, setInvitesLeft] = useState(2);
  const [receiverName, setReceiverName] = useState('');
  const [userInvites, setUserInvites] = useState<any[]>([]);

  const anchorWallet = useAnchorWallet();
  const { publicKey, signMessage } = useWallet();

  useEffect(() => {
    if (publicKey) {
      setLoading(true);
      if (isAdmin(publicKey)) {
        setInvitesLeft(Infinity);
        setLoading(false);
        return;
      }

      // Temporarily disabling new invitations from normal users
      // Remove this
      router.push('/');

      // Uncomment the following code

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

  useEffect(() => {
    (async function () {
      if (!publicKey) return;
      toast.loading('Fetching Invites');
      const request = await fetch('/api/invite/get/' + publicKey.toBase58());
      const response = await request.json();
      setUserInvites(response?.invites);
      toast.dismiss();
    })();
  }, [publicKey])

  const getInviteText = (invitesLeft: number): string => {
    if (invitesLeft === 1) return 'invite';
    return 'invites';
  }

  const handleSendInvite = async () => {
    if (!anchorWallet || !signMessage || !publicKey) return;
    if (invitesLeft === 0) {
      toast('Sorry, you don\'t have any invites left');
      return;
    };
    const signature = await getUserSignature(signMessage, publicKey.toBase58());
    if (!signature) return;
    toast.loading('Fetching wallet address from domain');
    const toInviteAddress = await getDomainOwner(domain);
    if (!toInviteAddress) {
      toast.error('Invalid domain');
      return;
    }
    toast.dismiss();
    const invite = await sendInvite(
      anchorWallet as any,
      toInviteAddress
    );
    if (!invite) return;
    const account = invite.toBase58();
    const saved = await createNewInvite({
      account: account,
      public_key: publicKey.toBase58(),
      signature: signature,
      receiver: toInviteAddress.toBase58(),
      receiver_name: receiverName
    });
    setInvitesLeft(invitesLeft - 1);
    router.replace(router.asPath);
  };

  const copyLink = (account: string) => {
    navigator.clipboard.writeText('https://wordcel.club/invitation/' + account);
    toast.success('Invitation link copied');
  };

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
              {publicKey && (
                <div>
                  <div className={styles.header}>
                    <img src={quill.src} alt="" />
                    <h1 className="heading center nm mt-2">You have {invitesLeft} {getInviteText(invitesLeft)}</h1>
                    <p className="light-sub-heading thin center">You can invite {invitesLeft} more friends to use the DApp</p>
                  </div>
                  <div className={styles.form}>
                    <input
                      onChange={(e) => setReceiverName(e.target.value)}
                      placeholder="Enter Invitee's name"
                      className="secondary-input"
                    />
                    <input
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder='Enter SOL Domain'
                      className="secondary-input mt-2"
                    />
                    <button
                      onClick={handleSendInvite}
                      disabled={!domain.toLowerCase().includes('.sol')}
                      className="secondary-btn mt-2"
                    >
                      Send Invite
                    </button>
                    {userInvites.length > 0 && (
                      <div className="mt-2 width-100">
                        {userInvites.map((invite, index) => (
                          <div
                            key={index}
                            onClick={() => copyLink(invite)}
                            className={styles.sentInvite}
                          >
                            <p className="light-sub-heading thin nm">{
                              invite.receiver_name ? invite.receiver_name : getTrimmedPublicKey(invite.account, 6)
                            }</p>
                            <div className="status">
                              <p className="status-text">Sent</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {!publicKey && (
                <RequestConnect />
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
