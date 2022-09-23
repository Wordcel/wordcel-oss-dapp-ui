import Link from 'next/link';
import date from 'date-and-time';
import styles from '@/styles/UserView.module.scss';

// Images
import viewsIcon from '@/images/icons/eye.svg';
import editArticle from '@/images/elements/edit-article.svg';
import defaultGradient from '@/images/gradients/draft-gradient.png';

// Tags
import twitterTag from '@/images/tags/twitter.svg';
import confirmedTag from '@/images/tags/confirmed.svg';
import draftTag from '@/images/tags/draft.svg';
import uploadedTag from '@/images/tags/uploaded.svg';

import { User } from '@prisma/client';
import { Article, Draft } from '@/types/props';
import { shortenSentence } from '@/lib/sanitize';
import { useRouter } from 'next/router';
import { numformat } from '@/lib/utils';

export const ArticlePreview = ({
  article,
  user
}: {
  article: Article;
  user: User | undefined;
}) => {
  const SEOData = {
    title: article.title,
    name: user?.name,
    image: user?.image_url
  };
  const base64Data = Buffer.from(JSON.stringify(SEOData)).toString('base64');
  const DefaultImage = `https://og.up.railway.app/article/${encodeURIComponent(base64Data)}`;

  return (
    <div className={styles.articleContainer}>
      <Link href={`/${user?.username}/${article.slug}`}>
        <a>
          <p className="text gray-700 weight-700 size-32 md nm pointer">{article.title}</p>
        </a>
      </Link>
      <div>
        <p>
          <span className="text size-20 weight-400 gray-400">
            {shortenSentence(article.description)}
          </span>
          <Link href={`/${user?.username}/${article.slug}`}><a>
            <span className="text size-16 weight-700 gray-500 pointer ml-1 op-1">
              READ MORE
            </span>
          </a></Link>
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
  user: User | null;
}) => {
  const router = useRouter();
  const created_at = new Date(article.created_at);
  const formatted_date = date.format(created_at, 'DD MMM YYYY');
  const isNotDraft = 'slug' in article;
  const containsSource = 'source' in article;

  return (
    <div className={styles.verticalContainer}>
      <div className={styles.verticalPreview}>
        <img src={article.image_url || defaultGradient.src} className={styles.verticalImage} />
        <div className={styles.verticalArticleText}>
          <Link href={isNotDraft ? `/${user?.username}/${article.slug}` : `/dashboard/edit/draft/${article.id}`}>
            <a>
              <p
                className={`text gray-600 weight-600 size-20 nm ${isNotDraft ? 'pointer' : ''}`}
              >
                {shortenSentence(article.title, 75)}
              </p>
            </a>
          </Link>
          <p className="text size-16 weight-500 gray-400 nm mt-1">
            {shortenSentence(article.description, 112)}
          </p>
        </div>
      </div>
      <div className={styles.verticalArticleAdditional}>
        {isNotDraft && (
          <img
            onClick={() => {
              if (article.on_chain) window.open(`https://explorer.solana.com/account/${article.proof_of_post}`, '_blank');
            }}
            className={styles.onChainTag}
            src={article.on_chain ? confirmedTag.src : uploadedTag.src}
            alt=""
            style={{ cursor: article.on_chain ? 'pointer' : 'default' }}
          />
        )}
        {!isNotDraft && containsSource && (
          <img
            className={styles.draftsTag}
            src={article.source === 'twitter' ? twitterTag.src : draftTag.src}
            alt=""
          />
        )}
        <p className="text size-16 weight-500 gray-400">{formatted_date}</p>
        {isNotDraft && (
          <>
            <img
              src={viewsIcon.src}
              alt=""
              className={styles.viewsIcon}
            />
            <p className="text size-16 weight-500 gray-400 ml-1">{numformat(article.views)}</p>
          </>
        )}
        <img
          onClick={() => {
            if (isNotDraft) {
              router.push(`/dashboard/edit/${user?.username}/${article.slug}`)
            } else {
              router.push(`/dashboard/edit/draft/${article.id}`)
            }
          }}
          className={styles.editArticle}
          src={editArticle.src}
          alt="Edit Article"
        />
      </div>
    </div>
  );
};
