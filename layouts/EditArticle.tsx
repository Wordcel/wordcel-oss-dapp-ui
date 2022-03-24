import dynamic from 'next/dynamic';
import styles from '@/styles/Editor.module.scss';
import { EditorCore } from "@react-editor-js/core";
import { GetArticleServerSide } from '@/types/props';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { useEffect, useCallback, useRef } from 'react';
import { DefaultHead } from './DefaultHead';
import { StaticNavbar } from './Navbar';


export const EditArticle = (props: GetArticleServerSide) => {
  let Editor = dynamic(() => import('@/layouts/Editor'), {
    ssr: false
  });
  let editorInstance = useRef<EditorCore | null>(null);
  const router = useRouter();
  const { publicKey } = useWallet();

  const handleInitialize = useCallback((instance) => {
    editorInstance.current = instance
  }, [])

  useEffect(() => {
    if (!publicKey || publicKey.toString() !== props.user_public_key) {
      router.push('/');
    }
  }, [publicKey, props]);

  return (
    <div>
      <DefaultHead />
      <StaticNavbar />
      <div className={styles.container}>
        <div className={styles.editorMaxWidth}>
          {typeof window !== 'undefined' && (
            <Editor
              blocks={JSON.parse(props.blocks || '')}
              handleInstance={handleInitialize}
            />
          )}
        </div>
      </div>
    </div>
  );
};


