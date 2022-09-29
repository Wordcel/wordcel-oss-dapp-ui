import slug from 'slug';
import { sanitizeHtml } from '@/lib/sanitize';
import { decode } from 'html-entities';

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
  const image_gallery_content = blocks.filter((block: any) => block.type === 'imageGallery');
  const title = headings[0]?.data.text || text_content[0]?.data.text|| 'Untitled Article';
  const description = text_content[0]?.data.text || 'No description';
  const image_url = image_content[0]?.data?.url || image_content[0]?.data?.file?.url || image_gallery_content[0]?.data?.urls?.[0] ||'';
  const decodedTitle = decode(title);
  const sanitizedSlug = slug(decodedTitle, {
    lower: true,
    remove: /[^A-Za-z0-9\s]/g
  });
  return {
    title: sanitizeHtml(title),
    description: sanitizeHtml(description),
    image_url,
    slug: sanitizedSlug
  }
};
