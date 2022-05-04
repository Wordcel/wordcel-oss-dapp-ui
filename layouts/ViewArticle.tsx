import dynamic from 'next/dynamic';
import styles from '@/styles/Reader.module.scss';
import editorStyles from '@/styles/Editor.module.scss';
import userStyles from '@/styles/UserView.module.scss';
import authorBadge from '@/images/elements/author-badge.svg';
import { GetArticleServerSide } from '@/types/props';
import { useState } from 'react';
import { DefaultHead } from './DefaultHead';
import { StaticNavbar } from './Navbar';
import { Footer } from './Footer';

export const AuthorBox = (props: GetArticleServerSide) => {
  const Name = props.user?.name;
  const Bio = props.user?.bio;
  const Avatar = props.user?.image_url || `https://avatars.wagmi.bio/${props.user?.name}`;
  const TrimmedPublicKey = props.user?.public_key.substring(0, 4)
    .concat('....')
    .concat(props.user?.public_key.substring(props.user?.public_key.length - 4));

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
          <p className="heading sm nm-bottom nm-top">{Name}</p>
          <p className="light-sub-heading nm">{TrimmedPublicKey}</p>
          {Bio && (
            <p className="normal-text sm nm-bottom mt-1">{Bio}</p>
          )}
        </div>
      </div>
    </div>
  );
};


export const ViewArticle = (props: GetArticleServerSide) => {
  const [blocks] = useState<any>(JSON.parse(props.blocks || ''));
  const Reader = dynamic(() => import('@/layouts/Reader'), {
    ssr: false
  });

  return (
    <div className="container-flex">
      <DefaultHead
        title={props.article?.title}
        description={props.article?.description}
        image={props.article?.image_url}
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
