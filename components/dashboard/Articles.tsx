// Styles Imports
import styles from '@/styles/Dashboard.module.scss';

// Component Imports
import { useState } from 'react';
import { useUser } from '../Context';

export const DashboardArticles = () => {
  const data = useUser();
  const [tab, setTab] = useState("published");

  const tabIsActive = (_tab: string) =>
    tab === _tab ? 'weight-600 gray-600' : 'weight-400 gray-400';

  const sliderLocation = () =>
    tab === 'drafts' ? styles.draftsSlider : '';

  const tabOnClick = (_tab: string) => setTab(_tab);

  return (
    <div className={styles.articlesContainer}>
      <div className={styles.articlesHeader}>
        <p onClick={() => tabOnClick('published')} className={`text pointer nm size-16 ${tabIsActive('published')}`}>Published</p>
        <p onClick={() => tabOnClick('drafts')} className={`text pointer nm size-16 ${tabIsActive('drafts')} ml-2`}>Drafts</p>
        <div className={`${styles.slider} ${sliderLocation()}`} />
      </div>
    </div>
  )
}