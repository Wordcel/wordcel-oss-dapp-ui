// Stylesheet
import styles from '@/styles/UserView.module.scss';

import { DefaultHead } from './DefaultHead';
import { StaticNavbar } from '@/layouts/Navbar';
import { GetUserServerSide } from '@/types/props';

// Images
import defaultBanner from '@/images/gradients/user-default-banner.png';

export const UserView = (props: GetUserServerSide) => {
  const Name = props.user?.name;
  const Bio = props.user?.bio;
  const SEOTitle = `${props.user?.blog_name} by ${props.user?.name}`
  const Banner = props.user?.banner_url || defaultBanner.src;
  const Avatar = props.user?.image_url || `https://avatars.wagmi.bio/${props.user?.name}`;
  const TrimmedPublicKey = props.user?.public_key.substring(0, 4)
    .concat('....')
    .concat(props.user?.public_key.substring(props.user?.public_key.length - 4));

    return (
      <>
        {props.user && (
          <div>
            <DefaultHead title={SEOTitle} description={Bio} />
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
                  <p className="heading sm nm-bottom">{Name}</p>
                  <p className="light-sub-heading nm mt-1">{TrimmedPublicKey}</p>
                  {Bio && (
                    <p className="normal-text thin">{Bio}</p>
                  )}
                  <p></p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Add a 404 component here, whenever done */}
    </>
  );
};
