// Stylesheet
import styles from '@/styles/UserView.module.scss';

import { Footer } from './Footer';
import { DefaultHead } from './DefaultHead';
import { StaticNavbar } from '@/layouts/Navbar';
import { GetUserServerSide } from '@/types/props';
import { ArticlePreview } from './ArticlePreview';

import { initializeSubscriberAccount } from '@/components/contractInteraction';

// Images
import defaultBanner from '@/images/gradients/user-default-banner.png';
import { useAnchorWallet } from '@solana/wallet-adapter-react';

export const UserView = (props: GetUserServerSide) => {
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
  return (
    <div className="container-flex">
      {props.user && wallet && (
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
                    <button onClick={() => initializeSubscriberAccount(wallet as any)} className="main-btn sm">SUBSCRIBE</button>
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
