import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import styles from '@/styles/Editor.module.scss';
import { publishPost } from '@/components/publishArticle';
import { EditorCore } from "@react-editor-js/core";
import { GetArticleServerSide } from '@/types/props';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { useEffect, useCallback, useRef, useState } from 'react';
import { DefaultHead } from './DefaultHead';
import { StaticNavbar } from './Navbar';
import { getUserSignature } from '@/components/signMessage';


export const EditArticle = (props: GetArticleServerSide) => {
  const router = useRouter();
  const [blocks] = useState<any>(JSON.parse(props.blocks || ''));
  const { publicKey, signMessage } = useWallet();
  const anchorWallet = useAnchorWallet();

  const Editor = dynamic(() => import('@/layouts/Editor'), {
    ssr: false
  });
  const editorInstance = useRef<EditorCore | null>(null);

  const handleInitialize = useCallback((instance) => {
    editorInstance.current = instance
  }, []);

  const handlePublish = async () => {
    if (!anchorWallet || !props.article) return;
    const savedContent = await editorInstance.current?.save();
    if (!savedContent || !signMessage) return;
    const signature = await getUserSignature(signMessage);
    if (!signature) return;
    const payload = {
      content: { blocks: savedContent.blocks },
      type: 'blocks'
    };
    const postTransaction = publishPost(
      payload,
      anchorWallet as any,
      signature,
      props.article?.id
    );
    toast.promise(postTransaction, {
      loading: 'Publishing Article',
      success: 'Article Published Successfully!',
      error: 'Publishing Failed!'
    });
    const txid = await postTransaction;
    if (!txid) return;
    console.log(`Transaction ID: ${txid}`);
    toast('Redirecting...');
    router.push(`/${props.username}/${props.article?.slug}`);
  }

  useEffect(() => {
    if (!publicKey || publicKey.toString() !== props.user_public_key) {
      router.push('/');
    }
  }, [publicKey, props]);

  return (
    <div>
      <DefaultHead
        title={`Edit - ${props.article?.title}`}
        description={props.article?.description}
        image={props.article?.image_url}
      />
      <StaticNavbar publish={handlePublish} />
      <div className={styles.container}>
        <div className={styles.editorMaxWidth}>
          {typeof window !== 'undefined' && (
            <div className="mb-main">
              <Editor
                blocks={blocks}
                handleInstance={handleInitialize}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
