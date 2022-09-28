// Styles
import styles from '@/styles/Feed.module.scss';

// Images
import newsIcon from '@/images/icons/news.svg';
import pattern from '@/images/elements/pattern.svg';

// Components
import { DefaultHead } from "@/components/DefaultHead"
import { Navbar } from "@/components/Navbar"
import { useState } from 'react';

function Feed() {
  const [tab, setTab] = useState(0);

  const getActiveTab = (t: number) => t === tab;

  return (
    <div>
      <Navbar />
      <DefaultHead />
      <div className={styles.header}>
        <div className={styles.headerItems}>
          <img className="mb-2" src={newsIcon.src} alt="" />
          <h1 className="nm text gray-800 size-24 weight-600">Your Feed</h1>
          <p className="nm text gray-500 size-22 weight-400 mt-1">Read the latest from your following or explore new</p>
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


      </div>
    </div>
  );

};

export default Feed;