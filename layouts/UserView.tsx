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
  getIfSubscribed,
  subscribeToPublication
} from '@/components/contractInteraction';

// Images
import defaultBanner from '@/images/gradients/user-default-banner.png';
import TwitterIcon from '@/images/dynamic/Twitter';
import DiscordIcon from '@/images/dynamic/Discord';

import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { getUserSignature } from '@/components/signMessage';
import { PublicKey } from '@solana/web3.js';
import { ConnectWallet } from './Wallet';
import { useEffect, useState } from 'react';
import { getDefaultUserImage } from '@/components/getDefaultPreviewImage';
import { useRouter } from 'next/router';


export const UserView = (props: GetUserServerSide) => {
  const router = useRouter();
  const wallet = useAnchorWallet();
  const { publicKey, signMessage } = useWallet();

  const [hideFollow, setHideFollow] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionKey, setSubscriptionKey] = useState('');
  const [clicked, setClicked] = useState(0);

  const Name = props.user?.name;
  const Bio = props.user?.bio;
  const SEOTitle = props.user?.blog_name ? `${props.user?.blog_name} by ${props.user?.name}` : '';
  const Banner = props.user?.banner_url || defaultBanner.src;
  const Avatar = props.user?.image_url || `https://avatars.wagmi.bio/${props.user?.name}`;
  const FollowersCount = props.user?.subscriber_count;
  const SEOImage = getDefaultUserImage(props.user);

  const refreshData = () => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    if (publicKey?.toBase58() === props.user?.public_key) {
      setHideFollow(true);
    }
    (async function () {
      if (publicKey && clicked !== 0 && props.user?.public_key && signMessage) {
        const signature = await getUserSignature(signMessage);
        if (!signature) return;
        if (subscribed && subscriptionKey) {
          const req = await cancelSubscription(
            wallet as any,
            new PublicKey(props.user.public_key),
            new PublicKey(subscriptionKey),
            setSubscribed,
            signature
          );
          refreshData();
          return;
        };
        const req = await subscribeToPublication(
          wallet as any,
          new PublicKey(props.user.public_key),
          setSubscribed,
          signature
        );
        refreshData();
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
                      <p className="light-sub-heading nm mt-1">@{props.user.username}</p>
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
                            {subscribed ? 'UNFOLLOW' : 'FOLLOW'}
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
                  {typeof FollowersCount !== 'undefined' && (
                    <p className="subheading xs">
                      {FollowersCount} <span className='subheading xs ml-0-5 light'>
                      {FollowersCount === 1 ? 'Follower' : 'Followers'}
                      </span>
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
