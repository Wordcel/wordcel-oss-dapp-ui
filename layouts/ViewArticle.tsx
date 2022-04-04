import dynamic from 'next/dynamic';
import styles from '@/styles/Editor.module.scss';
import { GetArticleServerSide } from '@/types/props';
import { useState } from 'react';
import { DefaultHead } from './DefaultHead';
import { StaticNavbar } from './Navbar';

export const ViewArticle = (props: GetArticleServerSide) => {
  const [blocks] = useState<any>(JSON.parse(props.blocks || ''));
  const [headingBlocks] = useState<any>([
    { type: 'header', data: { level: '1', text: props.article?.title } },
    { type: 'paragraph', data: { text: props.article?.description } },
    { type: 'image', data: { url: props.article?.image_url } },
  ]);
  const Reader = dynamic(() => import('@/layouts/Reader'), {
    ssr: false
  });

  const addedBlocks = [...headingBlocks, ...blocks];

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
              <Reader blocks={addedBlocks} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
