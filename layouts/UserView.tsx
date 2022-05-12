// Stylesheet
import styles from '@/styles/UserView.module.scss';

import { Footer } from './Footer';
import { DefaultHead } from './DefaultHead';
import { StaticNavbar } from '@/layouts/Navbar';
import { GetUserServerSide } from '@/types/props';
import { ArticlePreview } from './ArticlePreview';

import { subscribeToPublication } from '@/components/contractInteraction';

// Images
import defaultBanner from '@/images/gradients/user-default-banner.png';

import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { ConnectWallet } from './Wallet';
import { useEffect, useState } from 'react';

export const UserView = (props: GetUserServerSide) => {
  const [clicked, setClicked] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const { publicKey } = useWallet();
  const wallet = useAnchorWallet();

  const Name = props.user?.name;
  const Bio = props.user?.bio;
  const SEOTitle = `${props.user?.blog_name} by ${props.user?.name}`
  const Banner = props.user?.banner_url || defaultBanner.src;
  const Avatar = props.user?.image_url || `https://avatars.wagmi.bio/${props.user?.name}`;
  const TrimmedPublicKey = props.user?.public_key.substring(0, 4)
    .concat('....')
    .concat(props.user?.public_key.substring(props.user?.public_key.length - 4));
  const SEOData = {
    name: props.user?.name,
    image: props.user?.image_url,
    bio: props.user?.bio,
    username: props.user?.username
  }
  const base64Data = Buffer.from(JSON.stringify(SEOData)).toString('base64');
  const SEOImage = `https://i0.wp.com/og.up.railway.app/user/${base64Data}`

  useEffect(() => {
    if (publicKey && clicked !== 0 && props.user?.public_key) {
      if (subscribed) return;
      subscribeToPublication(
        wallet as any,
        new PublicKey(props.user.public_key),
        setSubscribed
      )
    };
    if (publicKey) {
      const json = localStorage.getItem('subscriptions');
      const data = JSON.parse(json || '[]');
      if (data.includes(props.user?.public_key)) {
        setSubscribed(true);
      }
    }
  }, [clicked, publicKey]);

  return (
    <div className="container-flex">
      {props.user && (
        <>
          <div>
            <DefaultHead title={SEOTitle} description={Bio} image={SEOImage} />
            <StaticNavbar />
            <div className={styles.profileContainer}>
              <div className={styles.banner}>
                <img src={Banner} alt="User Banner" />
              </div>
              <div className={styles.profilePadding}>
                <div className={styles.profile}>
                  <img
                    alt="Profile Picture"
                    src={Avatar}
                    className={styles.avatar}
                  />
                  <div className="flex align-items-center justify-space-between">
                    <div>
                      <p className="heading sm nm-bottom">{Name}</p>
                      <p className="light-sub-heading nm mt-1">{TrimmedPublicKey}</p>
                    </div>
                    <ConnectWallet
                      noFullSize={true}
                      redirectToWelcome={false}
                      noToast={true}
                    >
                      <button
                        onClick={() => setClicked(clicked + 1)}
                        className="main-btn sm"
                        style={{
                          backgroundColor: subscribed ? 'transparent' : '',
                          border: subscribed ? '0.2rem solid black' : '',
                          cursor: subscribed ? 'not-allowed' : 'pointer',
                          color: subscribed ? 'black' : ''
                        }}
                      >
                        {subscribed ? 'SUBSCRIBED' : 'SUBSCRIBE'}
                      </button>
                    </ConnectWallet>
                  </div>
                  {Bio && (
                    <p className="normal-text">{Bio}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.articles}>
            {props.articles && props.articles.map((article) => article.on_chain && (
              <ArticlePreview
                key={article.slug}
                article={article}
                user={props.user}
              />
            ))}
          </div>
        </>
      )}
      {/* Add a 404 component here, whenever done */}
      <Footer />
    </div>
  );
};
