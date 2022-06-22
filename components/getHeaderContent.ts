import slugify from 'slugify';
import { sanitizeHtml } from '@/lib/sanitize';

interface HeaderContent {
  title: string,
  description: string,
  image_url: string,
  slug: string
}

export const getHeaderContent = (
  blocks: any[]
): HeaderContent => {
  const headings = blocks.filter((block: any) => block.type === 'header');
  const text_content = blocks.filter((block: any) => block.type === 'paragraph');
  const image_content = blocks.filter((block: any) => block.type === 'image');
  const title = headings[0]?.data.text || text_content[0]?.data.text|| 'Untitled Article';
  const description = text_content[0]?.data.text || 'No description';
  const image_url = image_content[0]?.data.url || '';
  const sanitizedSlug = slugify(title, {
    lower: true,
    remove: /[*+~.()'"!:@]/g
  });
  return {
    title: sanitizeHtml(title),
    description: sanitizeHtml(description),
    image_url,
    slug: sanitizedSlug
  }
};
