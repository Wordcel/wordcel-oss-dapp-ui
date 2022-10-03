import styles from '@/styles/Feed.module.scss';
import defaultGradient from '@/images/gradients/draft-gradient.png';
import { Article } from '@/types/props';

function Preview({
  article
}: {
  article: Article
}) {
  return (
    <div className={styles.preview}>
      <div></div>
      <img
        className={styles.imagePreview}
        src={article.image_url || defaultGradient.src}
      />
    </div>
  )
}

export { Preview }