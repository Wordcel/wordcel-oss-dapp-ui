import date from 'date-and-time';
import Link from 'next/link';
import styles from '@/styles/Home.module.scss';
import { Article, User } from '@prisma/client';
import { Loading } from '@/components/animations/Loading';
import { useState, useEffect } from 'react';
import { getDefaultArticleImage } from '@/lib/getDefaultPreviewImage';
import { shortenSentence } from '@/lib/sanitize';
import { useWindowSize } from '../Hooks';

interface FetchedArticle extends Article {
  owner: User;
}

function PressCard({ article, vertical }: {
  article: FetchedArticle,
  vertical?: boolean
}) {
  const created_at = new Date(article.created_at);
  const formatted_date = date.format(created_at, 'DD MMM YYYY');
  return (
    <div className={vertical ? styles.pressCardVertical : styles.pressCard}>
      <img src={article.image_url || getDefaultArticleImage(article, article.owner)} alt="" />
      <div className={styles.pressCardText}>
        <p className="text nm font-2 white size-24 weight-600 pointer">
          {shortenSentence(article.title, 42)}
        </p>
        <p className="text nm font-2 weight-400 gray-400 size-16 mt-1">
          {shortenSentence(article.description, 128)}
        </p>
        <div className={styles.pressCardUser}>
          <img src={article.owner.image_url || ''} alt="" />
          <p className="text nm font-2 weight-500 white size-16">
            {article.owner.name}
            <span className="gray-700 ml-1 mr-1">•</span>
            <span className="text nm font-2 weight-700 gray-400 size-16">
              {formatted_date}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function PressSection() {
  const { width, height } = useWindowSize();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<FetchedArticle[]>([]);

  useEffect(() => {
    (async function() {
      const res = await fetch('/api/feed/explore');
      const data = await res.json();
      setArticles(data.splice(0, 4));
      setLoading(false);
    })();
  }, []);

  return (
    <div className={styles.pressSection}>
      <div className={styles.pressSectionContent}>
        <div className={styles.pressHeader}>
          <p className="text nm font-2 white size-40 weight-700">Off the press</p>
          <div className={styles.pressDivider} />
          <a href="/feed" target="_blank" rel="noopener noreferrer">
            <p className={styles.pressLink}>
              VIEW ALL
              <span>{"->"}</span>
            </p>
          </a>
        </div>
        <div className="mb-6" />
        {loading && (
          <div className="mt-4">
            <Loading width={200} height={200} />
          </div>
        )}
        {!loading && (
          <div className={styles.pressCards}>
            {width && width > 1150 && (
              <Link href={'/' + articles[0]?.owner.username + '/' + articles[0].slug}>
                <a>
                  <PressCard vertical={true} article={articles[0]} />
                </a>
              </Link>
            )}
            <div className={styles.articleStack}>
              {articles.map((article, i) => (
                <Link href={'/' + article.owner.username + '/' + article.slug} key={i}>
                  <a className={styles.articlePreview}>
                    <PressCard article={article} />
                  </a>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { PressSection };