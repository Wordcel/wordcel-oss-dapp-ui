import type { Article, User } from '@/types/props';

export const getDefaultArticleImage = (
  article: Article,
  user?: User
) => {
  console.log(user);
  const data = {
    title: article.title,
    name: user?.name,
    image: user?.image_url
  };
  const base64Data = Buffer.from(JSON.stringify(data)).toString('base64');
  const defaultImage = `https://og.up.railway.app/article/${encodeURIComponent(base64Data)}`;
  return defaultImage
};

export const getDefaultUserImage = (
  user?: User
) => {
  const data = {
    name: user?.name,
    image: user?.image_url,
    bio: user?.bio ? user?.bio : `Hi, I'm ${user?.name}, this is my Wordcel profile.`,
    username: user?.username
  }
  const base64Data = Buffer.from(JSON.stringify(data)).toString('base64');
  const defaultImage = `https://og.up.railway.app/user/${encodeURIComponent(base64Data)}`;
  return defaultImage;
};
