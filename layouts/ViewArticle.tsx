import date from 'date-and-time';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from '@/styles/Reader.module.scss';
import editorStyles from '@/styles/Editor.module.scss';
import userStyles from '@/styles/UserView.module.scss';
import authorBadge from '@/images/elements/author-badge.svg';
import { GetArticleServerSide } from '@/types/props';
import { useEffect, useState } from 'react';
import { DefaultHead } from './DefaultHead';
import { StaticNavbar } from './Navbar';
import { Footer } from './Footer';
import { getReadingTime } from '@/components/getReadingTime';
import { useRouter } from 'next/router';

export const AuthorBox = (props: GetArticleServerSide) => {
  const Name = props.user?.name;
  const Bio = props.user?.bio;
  const Avatar = props.user?.image_url || `https://avatars.wagmi.bio/${props.user?.name}`;

  return (
    <div className={styles.authorBox}>
      <img
        className={styles.authorBadge}
        src={authorBadge.src}
        alt="AUTHOR"
      />
      <div className="flex height-100">
        <img
          src={Avatar}
          className={userStyles.avatar}
          alt={props.user?.username}
        />
        <div className="ml-2">
          <Link href={`/${props.user?.username}`}>
            <a>
              <p className="heading sm nm-bottom nm-top">{Name}</p>
            </a>
          </Link>
          <p className="light-sub-heading nm">@{props.user?.username}</p>
          {Bio && (
            <p className="normal-text sm nm-bottom mt-1">{Bio}</p>
          )}
        </div>
      </div>
    </div>
  );
};


export const ViewArticle = (props: GetArticleServerSide) => {
  const { asPath } = useRouter();
  const [blocks] = useState<any>(JSON.parse(props.blocks || ''));
  const Reader: any = dynamic(() => import('@/layouts/Reader'), {
    ssr: false
  });
  const SEOData = {
    title: props.article?.title,
    name: props.user?.name,
    image: props.user?.image_url
  };
  const base64Data = Buffer.from(JSON.stringify(SEOData)).toString('base64');
  const SEOImage = `https://i0.wp.com/og.up.railway.app/article/${encodeURIComponent(base64Data)}`;

  const readingTime = getReadingTime(JSON.parse(props.blocks || ''));

  const insertAfter = (newNode: Node, existingNode: Node) => {
    existingNode.parentNode?.insertBefore(newNode, existingNode.nextSibling);
  }

  useEffect(() => {
    setTimeout(() => {
      const firstElement = document.getElementById('reader')?.firstElementChild;
      if (firstElement && props.article) {
        const created_at = new Date(props.article.created_at);
        const formatted_date = date.format(created_at, 'DD MMM, YYYY');
        const details = document.createElement('p');
        details.className = 'normal-text sm bold mt-1 mb-4';
        details.textContent = `${formatted_date} • ${readingTime} read`;
        insertAfter(details, firstElement);
      }
    }, 500)
  }, []);


  return (
    <div className="container-flex">
      <DefaultHead
        title={props.article?.title}
        description={props.article?.description}
        author={props.user?.name}
        blog_name={props.user?.blog_name}
        url={`https://wordcel.club/${asPath}`}
        image={SEOImage}
      />
      <StaticNavbar
        proof_of_post={{
          arweave_url: props.article?.arweave_url,
          account: props.article?.proof_of_post
        }}
      />
      <div className={editorStyles.container}>
        <div
          style={{ display: 'flex', justifyContent: 'center' }}
          className={editorStyles.editorMaxWidth}>
          {typeof window !== 'undefined' && (
            <div className="reader-max-width">
              <Reader blocks={blocks} />
              <AuthorBox {...props} />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
