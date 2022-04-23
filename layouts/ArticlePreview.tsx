import styles from '@/styles/UserView.module.scss';
import { Article, User } from '@/types/props';
import { shortenSentence } from '@/lib/sanitize';
import { useRouter } from 'next/router';

export const ArticlePreview = ({
  article,
  user
}: {
  article: Article;
  user: User | undefined;
}) => {
  const router = useRouter();
  return (
    <div className={styles.articleContainer}>
      <p className="heading md nm">{article.title}</p>
      <div className={styles.articleDescription}>
        <p className="normal-text cs">
          {shortenSentence(article.description)}
        </p>
        <p
          onClick={() => router.push(`/${user?.username}/${article.slug}`)}
          className="blue-text pointer">
          READ MORE
        </p>
      </div>
      <img className={styles.articleImage} src={article.image_url} />
    </div>
  );
};

