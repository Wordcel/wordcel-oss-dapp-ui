// Style Imports
import styles from '@/styles/Invite.module.scss';

// Component Imports
import { useEffect, useState } from 'react';

// Image imports
import quill from '@/images/elements/quill.svg';

// JSX Imports
import { DefaultHead } from "./DefaultHead";
import { Loading } from './Loading';
import { StaticNavbar } from "./Navbar";


export const InvitePage = () => {
  const [loading, setLoading] = useState(true);
  const [inviteAddress, setInviteAddress] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

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
                <h1 className="heading center nm mt-2">You have 2 invites</h1>
                <p className="light-sub-heading thin center">You can invite 2 more friends to use the DApp</p>
              </div>
              <div className={styles.form}>
                <input
                  onChange={(e) => setInviteAddress(e.target.value)}
                  placeholder='Enter wallet address'
                  className="secondary-input"
                />
                <button
                  disabled={inviteAddress.length !== 44}
                  className="secondary-btn mt-2"
                >Send Invite</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
