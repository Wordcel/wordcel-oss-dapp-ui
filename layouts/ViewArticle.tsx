import dynamic from 'next/dynamic';
import styles from '@/styles/Editor.module.scss';
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
      <StaticNavbar />
      <div className={styles.container}>
        <div
          style={{ display: 'flex', justifyContent: 'center' }}
          className={styles.editorMaxWidth}>
          {typeof window !== 'undefined' && (
            <div className="reader-max-width">
              <Reader blocks={blocks} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
