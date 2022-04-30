import dynamic from 'next/dynamic';
import styles from '@/styles/Reader.module.scss';
import editorStyles from '@/styles/Editor.module.scss';
import { GetArticleServerSide } from '@/types/props';
import { useState } from 'react';
import { DefaultHead } from './DefaultHead';
import { StaticNavbar } from './Navbar';

export const ViewArticle = (props: GetArticleServerSide) => {
  const [blocks] = useState<any>(JSON.parse(props.blocks || ''));
  const Reader = dynamic(() => import('@/layouts/Reader'), {
    ssr: false
  });

  return (
    <div>
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
              <div className={styles.authorBox}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
