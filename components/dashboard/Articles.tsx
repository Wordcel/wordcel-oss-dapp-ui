// Styles Imports
import styles from '@/styles/Dashboard.module.scss';

// Component Imports
import { getAllArticles, getAllDrafts } from '@/lib/networkRequests';
import { useUser } from '../Context';
import { useEffect, useState } from 'react';

// Type Imports
import { Article, Draft } from '@/types/props';

// JSX Imports
import { Loading } from '../animations/Loading';
import { VerticalArticlePreview } from '../ArticlePreview';

export const DashboardArticles = () => {
  const data = useUser();
  const [tab, setTab] = useState("published");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  const [articlesLoading, setArticlesLoading] = useState(true);
  const [draftsLoading, setDraftsLoading] = useState(true);

  const activeTabClass = (_tab: string) =>
    tab === _tab ? 'weight-600 gray-600' : 'weight-400 gray-400';

  const sliderLocation = () =>
    tab === 'drafts' ? styles.draftsSlider : '';

  const activeTab = (_tab: string) => tab === _tab;

  const tabOnClick = (_tab: string) => {
    setTab(_tab);
  };

  useEffect(() => {
    (async function () {
      if (!data?.user?.public_key) return;
      const articles = await getAllArticles(data.user.public_key);
      console.log(articles);
      if (articles) setArticles(articles);
      setArticlesLoading(false);
    })();
  }, [data]);

  useEffect(() => {
    (async function () {
      if (!data?.user?.public_key) return;
      const drafts = await getAllDrafts(data.user.public_key);
      console.log(drafts)
      if (drafts) setDrafts(drafts);
      setDraftsLoading(false);
    })();
  }, [data]);

  return (
    <div className={styles.articlesContainer}>
      <div className={styles.articlesHeader}>
        <p onClick={() => tabOnClick('published')} className={`text pointer nm size-16 ${activeTabClass('published')}`}>Published</p>
        <p onClick={() => tabOnClick('drafts')} className={`text pointer nm size-16 ${activeTabClass('drafts')} ml-2`}>Drafts</p>
        <div className={`${styles.slider} ${sliderLocation()}`} />
      </div>
      {(tab === 'published' && articlesLoading || tab === 'drafts' && draftsLoading) && (
        <div className={styles.loading}>
          <Loading width={200} height={200} />
        </div>
      )}
      {data?.user && (
        <div className={styles.articlesContent}>
          {!articlesLoading && tab === 'published' && articles.map((article, index) => (
            <VerticalArticlePreview key={index} article={article} user={data.user} />
          ))}
          {!draftsLoading && tab === 'drafts' && drafts.map((draft, index) => (
            <VerticalArticlePreview key={index} article={draft} user={data.user} />
          ))}
        </div>
      )}
    </div>
  );
}