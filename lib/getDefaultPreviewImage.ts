import type { Article } from '@/types/props';
import type { User } from '@prisma/client';
import type { User as PropsUser } from '@/types/props';

export const getDefaultArticleImage = (
  article: Article,
  user?: User | PropsUser
) => {
  const data = {
    title: article.title,
    name: user?.name,
    image: user?.image_url
  };
  const base64Data = Buffer.from(JSON.stringify(data)).toString('base64');
  const defaultImage = `https://d3ztzybo1ne7w.cloudfront.net/article/${encodeURIComponent(base64Data)}`;
  return defaultImage
};

export const getDefaultUserImage = (
  user?: PropsUser
) => {
  const data = {
    name: user?.name,
    image: user?.image_url,
    bio: user?.bio ? user?.bio : `Hi, I'm ${user?.name}, this is my Wordcel profile.`,
    username: user?.username
  }
  const base64Data = Buffer.from(JSON.stringify(data)).toString('base64');
  const defaultImage = `https://d3ztzybo1ne7w.cloudfront.net/user/${encodeURIComponent(base64Data)}`;
  return defaultImage;
};
