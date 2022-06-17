import type { Article, User } from '@/types/props';

export const getDefaultArticleImage = (
  article: Article,
  user?: User
) => {
  const data = {
    title: article.title,
    name: user?.name,
    image: user?.image_url
  };
  const base64Data = Buffer.from(JSON.stringify(data)).toString('base64');
  const defaultImage = `https://i0.wp.com/og.up.railway.app/article/${encodeURIComponent(base64Data)}`;
  return defaultImage
};

export const getDefaultUserImage = (
  user?: User
) => {
  const data = {
    name: user?.name,
    image: user?.image_url,
    bio: user?.bio,
    username: user?.username
  }
  const base64Data = Buffer.from(JSON.stringify(data)).toString('base64');
  const defaultImage = `https://i0.wp.com/og.up.railway.app/user/${encodeURIComponent(base64Data)}`;
  return defaultImage;
};
