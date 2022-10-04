// Styles
import styles from '@/styles/Feed.module.scss';

// Images
import newsIcon from '@/images/icons/news.svg';
import pattern from '@/images/elements/pattern.svg';

// Components
import { DefaultHead } from "@/components/DefaultHead"
import { Navbar } from "@/components/Navbar"
import { useEffect, useState } from 'react';
import { ArticleWithOwner } from '@/types/props';
import { Loading } from '@/components/animations/Loading';
import { useWallet } from '@solana/wallet-adapter-react';
import { Preview } from '@/components/FeedPreview';

function Feed() {
  const { publicKey } = useWallet();
  const getActiveTab = (t: number) => t === tab;

  const [tab, setTab] = useState(0);
  const [exploreLoading, setExploreLoading] = useState(true);
  const [followingLoading, setFollowingLoading] = useState(true);
  const [exploreArticles, setExploreArticles] = useState<ArticleWithOwner[]>([]);
  const [followingArticles, setFollowingArticles] = useState<ArticleWithOwner[]>([]);

  useEffect(() => {
    (async function () {
      const request = await fetch('/api/feed/explore');
      const articles = await request.json();
      console.log(articles);
      setExploreArticles(articles);
      setExploreLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async function () {
      if (!publicKey) return;
      const request = await fetch('/api/feed/connections/' + publicKey.toBase58());
      const articles = await request.json();
      console.log(articles);
      setFollowingArticles(articles);
      setFollowingLoading(false);
    })();
  }, [publicKey]);

  return (
    <div>
      <Navbar />
      <DefaultHead />

      {/* Top Bar Content */}
      <div className={styles.header}>
        <div className={styles.headerItems}>
          <img className="mb-2" src={newsIcon.src} alt="" />
          <h1 className="nm text gray-800 size-24 weight-600">Your Feed</h1>
          <p className="nm text gray-500 size-22 weight-400 mt-1">Read the hottest this week or from your following</p>
          <img className={styles.headerPattern} src={pattern.src} alt="" />
        </div>
      </div>

      <div className={styles.container}>

        {/* Tabs */}
        <div className={styles.tabContainer}>
          <p className={getActiveTab(0) ? styles.activeTab : ""} onClick={() => setTab(0)}>Explore</p>
          <p className={getActiveTab(1) ? styles.activeTab : ""} onClick={() => setTab(1)}>Following</p>
          <div
            style={{
              width: tab === 0 ? '7rem' : '9rem',
              left: tab === 0 ? '0%' : '9rem'
            }}
            className={styles.activeBorder}
          />
        </div>

        {/* Explore */}
        {tab === 0 && (
          <div className="mt-4">
            {exploreLoading && (
              <Loading width={200} height={200} />
            )}
            {!exploreLoading && (
              <div className={styles.articleContainer}>
                {exploreArticles.map((article, index) => (
                  <Preview article={article} key={index} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Following */}
        {tab === 1 && (
          <div className="mt-4">
            {!publicKey && (
              <p>{"Please connect your wallet to view articles from your following"}</p>
            )}
            {followingLoading && publicKey && (
              <Loading width={200} height={200} />
            )}
            {!followingLoading && followingArticles.length > 0 && (
              <div className={styles.articleContainer}>
                {followingArticles.map((article, index) => (
                  <Preview article={article} key={index} />
                ))}
              </div>
            )}
            {!followingLoading && followingArticles.length === 0 && (
              <p>{"No articles to display here :("}</p>
            )}
          </div>
        )}

      </div>
    </div>
  );

};

export default Feed;