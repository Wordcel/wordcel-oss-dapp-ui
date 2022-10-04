import Link from 'next/link';
import date from 'date-and-time';
import styles from '@/styles/Feed.module.scss';
import { ArticleWithOwner } from '@/types/props';
import { shortenSentence } from '@/lib/sanitize';
import { getDefaultArticleImage } from '@/lib/getDefaultPreviewImage';

function Preview({
  article
}: {
  article: ArticleWithOwner
}) {
  return (
    <div className={styles.preview}>
      <div className={styles.previewDetails}>
        <a href={'/' + article.owner.username + '/' + article.slug} target="_blank" rel="noopener noreferrer">
          <h1 className="text size-28 weight-700 gray-700 pointer">{shortenSentence(article.title, 50)}</h1>
        </a>
        <p className="text size-16 weight-400 gray-500">
          {shortenSentence(article.description)}
          <Link href={'/' + article.owner.username + '/' + article.slug}>
            <a>
              <span className="text ml-1 weight-700 pointer">READ MORE</span>
            </a>
          </Link>
        </p>
        <div className={styles.previewUser}>
          <img
            src={article.owner.image_url}
            alt=""
            className={styles.previewPfP}
          />
          <a href={'/' + article.owner.username} target="_blank" rel="noopener noreferrer">
            <p className="text size-16 weight-600 gray-500 ml-2">
              {article.owner.name}
            </p>
          </a>
          <span className="text size-16 weight-600 gray-300 ml-1">•</span>
          <p className="text size-16 weight-600 gray-300 ml-1">
            {date.format(new Date(article.created_at), 'DD MMM YYYY')}
          </p>
        </div>
      </div>
      <img
        className={styles.imagePreview}
        src={article.image_url || getDefaultArticleImage(article, article.owner)}
      />
    </div>
  )
}

export { Preview }