import type { Article, User } from '@/types/props';

export const getDefaultArticleImage = (
  article: Article,
  user?: User
) => {
  const SEOData = {
    title: article.title,
    name: user?.name,
    image: user?.image_url
  };
  const base64Data = Buffer.from(JSON.stringify(SEOData)).toString('base64');
  const defaultImage = `https://i0.wp.com/og.up.railway.app/article/${base64Data}`;
  return defaultImage
};
