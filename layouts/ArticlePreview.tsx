import date from 'date-and-time';
import styles from '@/styles/UserView.module.scss';
import editArticle from '@/images/elements/edit-article.svg';
import { Article, Draft, User } from '@/types/props';
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
  const SEOData = {
    title: article.title,
    name: user?.name,
    image: user?.image_url
  };
  const base64Data = Buffer.from(JSON.stringify(SEOData)).toString('base64');
  const DefaultImage = `https://og.up.railway.app/article/${encodeURIComponent(base64Data)}`;
  return (
    <div className={styles.articleContainer}>
      <p
        onClick={() => router.push(`/${user?.username}/${article.slug}`)}
        className="heading md nm pointer">{article.title}</p>
      <div>
        <p>
          <span className="normal-text cursive-text">
            {shortenSentence(article.description)}
          </span>
          <span
            onClick={() => router.push(`/${user?.username}/${article.slug}`)}
            className="blue-text pointer ml-1 op-1">
            READ MORE
          </span>
        </p>
      </div>
      <img className={styles.articleImage} src={article.image_url || DefaultImage} />
    </div>
  );
};

export const VerticalArticlePreview = ({
  article,
  user
}: {
  article: Article | Draft;
  user: User | undefined;
}) => {
  const router = useRouter();
  const created_at = new Date(article.created_at);
  const formatted_date = date.format(created_at, 'DD MMM YYYY');
  const SEOData = {
    title: article.title,
    name: user?.name,
    image: user?.image_url
  };
  const base64Data = Buffer.from(JSON.stringify(SEOData)).toString('base64');
  const DefaultImage = `https://og.up.railway.app/article/${encodeURIComponent(base64Data)}`;
  const isNotDraft = 'slug' in article;

  return (
    <div className={styles.verticalContainer}>
      <div className={styles.verticalPreview}>
        <img src={article.image_url || DefaultImage} className={styles.verticalImage} />
        <div className={styles.verticalArticleText}>
          <p
            onClick={() => {
              if (isNotDraft) {
                router.push(`/${user?.username}/${article.slug}`)
              }
            }}
            className={`subheading sm nm ${isNotDraft ? 'pointer' : ''}`}>{shortenSentence(article.title, 75)}</p>
          <p className="normal-text cursive-text nm mt-1">
            {shortenSentence(article.description, 112)}
          </p>
        </div>
      </div>
      <div className={styles.verticalArticleAdditional}>
        <div className="width-100">
          <p className="normal-text sm nm">{formatted_date}</p>
        </div>
        <img
          onClick={() => {
            if (isNotDraft) {
              router.push(`/edit/${user?.username}/${article.slug}`)
            } else {
              router.push(`/edit/draft/${article.id}`)
            }
          }}
          className={styles.editArticle} src={editArticle.src} alt="Edit Article" />
      </div>
    </div>
  );
};
