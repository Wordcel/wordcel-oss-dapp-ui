// Stylesheet
import styles from '@/styles/UserView.module.scss';

import { Footer } from '../components/Footer';
import { DefaultHead } from '../components/DefaultHead';
import { Navbar } from '@/components/Navbar';
import { Article, GetUserServerSide } from '@/types/props';
import { ArticlePreview } from '../components/ArticlePreview';

// @ts-expect-error
import AnchorifyText from 'react-anchorify-text';
import Link from 'next/link'

import {
  closeConnection,
  createConnection
} from '@/lib/contractInteraction';
import { fetchUserArticles, getIfConnected } from '@/lib/networkRequests';

// Images
import defaultBanner from '@/images/gradients/user-default-banner.png';
import TwitterIcon from '@/images/dynamic/Twitter';
import DiscordIcon from '@/images/dynamic/Discord';

import { Pagination } from "react-pagination-bar"
import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { getUserSignature } from '@/lib/signMessage';
import { PublicKey } from '@solana/web3.js';
import { ConnectWallet } from '../components/Wallet';
import { useEffect, useState } from 'react';
import { getDefaultUserImage } from '@/lib/getDefaultPreviewImage';
import { useRouter } from 'next/router';
import { EditProfile } from '@/elements/EditProfile';
import { NotFoundElement } from '@/components/404';
import { User } from '@prisma/client';
import { getTrimmedPublicKey } from '@/lib/getTrimmedPublicKey';
import { TipButton } from '@/components/Buttons';
import { Loading } from '@/components/animations/Loading';


export const UserProfile = ({
  props
}: {
  props: GetUserServerSide;
}) => {

  const router = useRouter();
  const wallet = useAnchorWallet();
  const { publicKey, signMessage } = useWallet();

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hideFollow, setHideFollow] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connectionKey, setConnectionKey] = useState('');
  const [currentPosts, setCurrentPosts] = useState<Article[]>([]);

  const Name = props.user?.name;
  const Bio = props.user?.bio;
  const Banner = props.user?.banner_url || defaultBanner.src;
  const Avatar = props.user?.image_url || `https://avatars.wagmi.bio/${props.user?.name}`;
  const FollowersCount = props.user?.connection_count;
  const PostsCount = props.post_count;

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const checkIfConnected = async () => {
    if (wallet && props.user?.public_key) {
      try {
        const res = await getIfConnected(wallet, props.user.public_key, true);
        if (res.error) return false;
        setConnectionKey(res.connection.account);
        setConnected(true);
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    } else {
      return false;
    }
  }

  const isSameUser = publicKey?.toBase58() === props.user?.public_key;

  const unfollow = async () => {
    if (!props.user?.public_key || !signMessage || !publicKey || isSameUser || !wallet) return;
    const signature = await getUserSignature(signMessage, publicKey.toBase58());
    if (!signature) return;
    if (connectionKey) {
      await closeConnection(
        wallet,
        new PublicKey(props.user.public_key),
        setConnected,
        signature
      );
      refreshData();
      return;
    };
  }

  const follow = async () => {
    if (!props.user?.public_key || !signMessage || !publicKey || isSameUser || !wallet) return;
    const alreadyConnected = await checkIfConnected();
    if (alreadyConnected) return;
    const signature = await getUserSignature(signMessage, publicKey.toBase58());
    if (!signature) return;
    await createConnection(
      wallet,
      new PublicKey(props.user.public_key),
      setConnected,
      signature
    );
    refreshData();
  }

  useEffect(() => {
    if (publicKey?.toBase58() === props.user?.public_key) {
      setHideFollow(true);
    }
  }, [publicKey]);

  useEffect(() => {
    (async function () {
      const getConnected = await checkIfConnected();
      setConnected(getConnected);
    })();
  }, [wallet, publicKey, connected]);

  const handlePageChange = async (page: number) => {
    if (!props.user?.public_key) return;
    setPage(page);
    setLoading(true);
    typeof window !== 'undefined' && window.scrollTo(0, 0);
    const posts = await fetchUserArticles(props.user?.public_key, page);
    setCurrentPosts(posts);
    setLoading(false);
  }

  return (
    <>
      {props.user && (
        <div>
          <div>
            <div className={styles.profileContainer}>
              <div className={styles.banner}>
                <img src={Banner} alt="User Banner" />
              </div>
              <div className={styles.profilePadding}>
                <div className={styles.profile}>
                  <div className={styles.profileHeader}>
                    <div className="flex align-center">
                      <img
                        alt="Profile Picture"
                        src={Avatar}
                        className={styles.avatar}
                      />
                      <div className={styles.profileNamePublicKey}>
                        <p className="text size-32 weight-700 gray-700 nm">{Name}</p>
                        <p className="text size-20 weight-500 gray-400 nm mt-1">
                          {props.user.username} • {getTrimmedPublicKey(props.user.public_key)}
                        </p>
                      </div>
                    </div>
                    <div className={styles.profileButtons}>
                      {props.user.tip_enabled && (
                        <div className='mr-1-5'>
                          <ConnectWallet noFullSize={true} noToast={true}>
                            <TipButton user={props.user} />
                          </ConnectWallet>
                        </div>
                      )}
                      {!hideFollow && (
                        <ConnectWallet noFullSize={true} noToast={true}>
                          <button
                            onClick={() => {
                              connectionKey ? unfollow() : follow();
                            }}
                            className={`main-btn sm follow-btn ${connected ? 'connected' : ''}`}
                          >
                            {connected ? 'Unfollow' : 'Follow'}
                          </button>
                        </ConnectWallet>
                      )}
                    </div>
                  </div>
                  {Bio && (
                    <p className="text size-20 weight-400 gray-500 mt-4 mb-3">
                      <AnchorifyText text={Bio}></AnchorifyText>
                    </p>
                  )}
                  <div className={styles.profileAdditional}>
                    <div className={styles.profileAdditionalLeft}>
                      {props.user.twitter && (
                        <a
                          href={`https://twitter.com/${props.user.twitter}`}
                          rel="noopener noreferrer"
                          target="_blank"
                          key={props.user.twitter}>
                            <TwitterIcon color="#94A3B8" />
                        </a>
                      )}
                      {props.user.discord && (
                        <a
                          href={props.user.discord}
                          rel="noopener noreferrer"
                          target="_blank"
                          key={props.user.discord}>
                            <DiscordIcon color="#94A3B8" />
                        </a>
                      )}
                      {typeof PostsCount !== 'undefined' && (
                        <p className="text size-16 weight-700 gray-700">
                          {PostsCount}
                          <span className='ml-1 text size-16 weight-600 gray-400'>
                            {PostsCount === 1 ? 'Post' : 'Posts'}
                          </span>
                        </p>
                      )}
                      {typeof FollowersCount !== 'undefined' && (
                        <p className="text size-16 weight-700 gray-700">
                          {FollowersCount}
                          <span className='ml-1 text size-16 weight-600 gray-400'>
                            {FollowersCount === 1 ? 'Follower' : 'Followers'}
                          </span>
                        </p>
                      )}
                    </div>
                    {props.user.invited_by && (
                      <p>Invited by <span className="text weight-600">
                        <Link href={'/' + props.user.invited_by.username}>
                          <a>{props.user.invited_by.name}</a>
                        </Link>
                      </span></p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.articles}>
            {page === 1 && props.articles && props.articles.map((article) => article.arweave_url && (
              <ArticlePreview
                key={article.slug}
                article={article}
                user={props.user as User}
              />
            ))}
            {page > 1 && !loading && currentPosts.length > 0 && currentPosts.map((a, i) => (
              <ArticlePreview
                key={i}
                article={a}
                user={props.user as User}
              />
            ))}
            {page > 1 && loading && (
              <Loading width={200} height={200} />
            )}
          </div>
          <Pagination
            currentPage={page}
            itemsPerPage={10}
            onPageChange={handlePageChange}
            totalItems={props.post_count ? props.post_count : 0}
            pageNeighbours={2}
          />
        </div>
      )}
    </>
  )
}


export const UserView = (props: GetUserServerSide) => {
  const Bio = props.user?.bio;
  const SEOTitle = props.user?.blog_name ? `${props.user?.blog_name} by ${props.user?.name}` : '';
  const SEOImage = getDefaultUserImage(props.user);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const editProfile = () => {
    setModalIsOpen(true);
  };

  const defaultEditValues = {
    name: props.user?.name,
    bio: props.user?.bio,
    image_url: props.user?.image_url,
    blog_name: props.user?.blog_name,
    twitter: props.user?.twitter,
    discord: props.user?.discord
  };

  return (
    <div className="container-flex">
      <DefaultHead title={SEOTitle} description={Bio} image={SEOImage} />
      <Navbar
        editProfile={{
          edit: editProfile,
          owner: props.user?.public_key
        }}
      />
      <EditProfile
        defaultData={defaultEditValues}
        isOpen={modalIsOpen}
        setIsOpen={setModalIsOpen}
      />
      {props.user && (
        <UserProfile props={props} />
      )}
      {!props.user && (
        <NotFoundElement />
      )}
      <Footer />
    </div>
  );
};
