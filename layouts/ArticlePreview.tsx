import date from 'date-and-time';
import styles from '@/styles/UserView.module.scss';
import editArticle from '@/images/elements/edit-article.svg';
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
      <div>
        <p>
          <span className="normal-text cs">
            {shortenSentence(article.description)}
          </span>
          <span
            onClick={() => router.push(`/${user?.username}/${article.slug}`)}
            className="blue-text pointer ml-1 op-1">
            READ MORE
          </span>
        </p>
      </div>
      <img className={styles.articleImage} src={article.image_url} />
    </div>
  );
};

export const VerticalArticlePreview = ({
  article,
  user
}: {
  article: Article;
  user: User | undefined;
}) => {
  const router = useRouter();
  const created_at = new Date(article.created_at);
  const formatted_date = date.format(created_at, 'DD MMM YYYY');
  return (
    <div className={styles.verticalContainer}>
      <div className={styles.verticalPreview}>
        <img src={article.image_url} className={styles.verticalImage} />
        <div className={styles.verticalArticleText}>
          <p
            onClick={() => router.push(`/${user?.username}/${article.slug}`)}
            className="subheading sm nm pointer">{shortenSentence(article.title, 75)}</p>
          <p className="normal-text cs nm mt-1">
            {shortenSentence(article.description, 112)}
          </p>
        </div>
      </div>
      <div className={styles.verticalArticleAdditional}>
        <p className="normal-text sm nm width-100">{formatted_date}</p>
        <img
          onClick={() => router.push(`/edit/${user?.username}/${article.slug}`)}
          className={styles.editArticle} src={editArticle.src} alt="Edit Article" />
      </div>
    </div>
  )
}