// Styles Imports
import styles from '@/styles/Dashboard.module.scss';
import { Article, Draft } from '@/types/props';

// Component Imports
import { useEffect, useState } from 'react';
import { Loading } from '../animations/Loading';
import { useUser } from '../Context';

export const DashboardArticles = () => {
  const data = useUser();
  const [tab, setTab] = useState("published");
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  const tabIsActive = (_tab: string) =>
    tab === _tab ? 'weight-600 gray-600' : 'weight-400 gray-400';

  const sliderLocation = () =>
    tab === 'drafts' ? styles.draftsSlider : '';

  const tabOnClick = (_tab: string) => {
    setLoading(true);
    setTab(_tab);
  };

  useEffect(() => {
    // Add articles fetch

  }, []);

  useEffect(() => {
    // Add drafts fetch

  }, []);

  return (
    <div className={styles.articlesContainer}>
      <div className={styles.articlesHeader}>
        <p onClick={() => tabOnClick('published')} className={`text pointer nm size-16 ${tabIsActive('published')}`}>Published</p>
        <p onClick={() => tabOnClick('drafts')} className={`text pointer nm size-16 ${tabIsActive('drafts')} ml-2`}>Drafts</p>
        <div className={`${styles.slider} ${sliderLocation()}`} />
      </div>
      {loading && (
        <div className={styles.loading}>
          <Loading width={200} height={200} />
        </div>
      )}
    </div>
  )
}