// Style Imports
import styles from '@/styles/Static.module.scss';

// Component Imports
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import {
  getInviteAccount,
  isAdmin,
  sendInvite
} from '@/lib/invitationIntegration';
import {
  useAnchorWallet,
  useWallet
} from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { createNewInvite } from '@/lib/networkRequests';
import { getUserSignature } from '@/lib/signMessage';
import { getTrimmedPublicKey } from '@/lib/getTrimmedPublicKey';
import { getDomainOwner } from '@/lib/verifySolDomain';
import { PublicKey } from '@solana/web3.js';
import { validateSolanaAddress } from '@/lib/utils';

// Image imports
import quill from '@/images/elements/quill.svg';

// JSX Imports
import { Navbar } from "@/components/Navbar";
import { Loading } from '@/components/animations/Loading';
import { MainLayout } from "@/components/dashboard/MainLayout";
import { DefaultHead } from "@/components/DefaultHead";
import { RequestConnect } from '@/elements/RequestConnect';


function InvitePage() {
  const { publicKey, signMessage } = useWallet();

  const router = useRouter();
  const anchorWallet = useAnchorWallet();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [invitesLeft, setInvitesLeft] = useState(2);
  const [receiverName, setReceiverName] = useState('');
  const [userInvites, setUserInvites] = useState<any[]>([]);

  useEffect(() => {
    if (publicKey) {
      setLoading(true);
      if (isAdmin(publicKey)) {
        setInvitesLeft(Infinity);
        setLoading(false);
        return;
      }
      (async function () {
        let user_account;
        try {
          user_account = await getInviteAccount(anchorWallet as any);
        } catch {
          router.push('/');
          return;
        }
        console.log('Invites left', user_account.invitesLeft);
        setInvitesLeft(user_account.invitesLeft as number);
        setLoading(false);
      })();
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
    const toInviteAddress = address.endsWith('.sol') ? await getDomainOwner(address.toLowerCase()) : new PublicKey(address);
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
    await createNewInvite({
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
    navigator.clipboard.writeText('https://wordcelclub.com/invitation/' + account);
    toast.success('Invitation link copied');
  };

  const addressIsValid = address.toLowerCase().includes('.sol') || validateSolanaAddress(address);

  return (
    <div>
      <DefaultHead title="Invite to Wordcel" />
      <Navbar />
      <MainLayout>
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
                    <h1 className="heading nm mt-2">You have {invitesLeft} {getInviteText(invitesLeft)}</h1>
                    <p className="light-sub-heading thin">You can invite {invitesLeft} more {invitesLeft === 1 ? 'friend' : 'friends'} to use the DApp</p>
                  </div>
                  <div className={styles.form}>
                    <input
                      onChange={(e) => setReceiverName(e.target.value)}
                      placeholder="Enter Invitee's name"
                      className="secondary-input"
                    />
                    <input
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder='Enter .SOL domain or wallet address'
                      className="secondary-input mt-2"
                    />
                    <button
                      onClick={handleSendInvite}
                      disabled={!addressIsValid}
                      className="secondary-btn mt-2"
                    >
                      Send Invite
                    </button>
                    {userInvites.length > 0 && (
                      <div className="mt-2 width-100">
                        {userInvites.map((invite, index) => (
                          <div
                            key={index}
                            onClick={() => copyLink(invite.account)}
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
      </MainLayout>
    </div>
  );
}

export default InvitePage;