// Stylesheet
import styles from '@/styles/UserView.module.scss';

import { Footer } from './Footer';
import { DefaultHead } from './DefaultHead';
import { StaticNavbar } from '@/layouts/Navbar';
import { GetUserServerSide } from '@/types/props';
import { ArticlePreview } from './ArticlePreview';

// @ts-expect-error
import AnchorifyText from 'react-anchorify-text';

import {
  cancelSubscription,
  subscribeToPublication
} from '@/components/contractInteraction';
import { getIfSubscribed } from '@/components/networkRequests';

// Images
import defaultBanner from '@/images/gradients/user-default-banner.png';
import TwitterIcon from '@/images/dynamic/Twitter';
import DiscordIcon from '@/images/dynamic/Discord';

import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { getUserSignature } from '@/components/signMessage';
import { PublicKey } from '@solana/web3.js';
import { ConnectWallet } from './Wallet';
import { useEffect, useState } from 'react';


export const UserView = (props: GetUserServerSide) => {
  const wallet = useAnchorWallet();
  const [clicked, setClicked] = useState(0);
  const [hideFollow, setHideFollow] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionKey, setSubscriptionKey] = useState('');
  const { publicKey, signMessage } = useWallet();

  const Name = props.user?.name;
  const Bio = props.user?.bio;
  const SEOTitle = props.user?.blog_name ? `${props.user?.blog_name} by ${props.user?.name}` : '';
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
    if (publicKey?.toBase58() === props.user?.public_key) {
      setHideFollow(true);
    }
    (async function () {
      if (publicKey && clicked !== 0 && props.user?.public_key && signMessage) {
        const signature = await getUserSignature(signMessage);
        if (!signature) return;
        if (subscribed && subscriptionKey) {
          cancelSubscription(
            wallet as any,
            new PublicKey(props.user.public_key),
            new PublicKey(subscriptionKey),
            setSubscribed,
            signature
          )
          return;
        };
        subscribeToPublication(
          wallet as any,
          new PublicKey(props.user.public_key),
          setSubscribed,
          signature
        )
      };
    })();
  }, [clicked, publicKey]);

  useEffect(() => {
    (async function () {
      if (wallet && props.user?.public_key) {
        try {
          const subscription = await getIfSubscribed(wallet as any, props.user.public_key, true);
          if (subscription.error) return;
          setSubscriptionKey(subscription.subscription.account);
          setSubscribed(true);
        } catch (e) {
          console.log(e);
        }
      }
    })();
  }, [wallet, publicKey, subscribed])

  return (
    <div className="container-flex">
      <DefaultHead title={SEOTitle} description={Bio} image={SEOImage} />
      <StaticNavbar />
      {props.user && (
        <>
          <div>
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
                    <div className="mt-2">
                      {!hideFollow && (
                        <ConnectWallet noFullSize={true} noToast={true}>
                          <button
                            onClick={() => setClicked(clicked + 1)}
                            className="main-btn sm subscribe-btn"
                            style={{
                              backgroundColor: subscribed ? 'transparent' : '',
                              border: subscribed ? '0.2rem solid black' : '',
                              color: subscribed ? 'black' : ''
                            }}
                          >
                            {subscribed ? 'UNSUBSCRIBE' : 'SUBSCRIBE'}
                          </button>
                        </ConnectWallet>
                      )}
                      <div className="user-socials">
                        {props.user.twitter && (
                          <a
                            href={`https://twitter.com/${props.user.twitter}`}
                            rel="noopener noreferrer"
                            target="_blank"
                            key={props.user.twitter}>
                              <TwitterIcon color="#1E2833" />
                          </a>
                        )}
                        {props.user.discord && (
                          <a
                            href={props.user.discord}
                            rel="noopener noreferrer"
                            target="_blank"
                            key={props.user.discord}>
                              <DiscordIcon color="#1E2833" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  {Bio && (
                    <p className="normal-text">
                      <AnchorifyText text={Bio}></AnchorifyText>
                    </p>
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
