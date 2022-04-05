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
import toast from 'react-hot-toast';
import { getUserSignature } from '@/components/signMessage';


export const EditArticle = (props: GetArticleServerSide) => {
  const router = useRouter();
  const [blocks] = useState<any>(JSON.parse(props.blocks || ''));
  console.log(blocks);
  const [headingBlocks] = useState<any>([
    { type: 'header', data: { level: '1', text: props.article?.title } },
    { type: 'paragraph', data: { text: props.article?.description } },
    { type: 'image', data: { url: props.article?.image_url } },
  ]);
  const { publicKey, signMessage } = useWallet();
  const anchorWallet = useAnchorWallet();

  const Editor = dynamic(() => import('@/layouts/Editor'), {
    ssr: false
  });
  let headerInstance = useRef<EditorCore | null>(null);
  let editorInstance = useRef<EditorCore | null>(null);

  const handleInitialize = useCallback((instance) => {
    editorInstance.current = instance
  }, []);

  const handleHeaderEditorInit = useCallback((instance) => {
    headerInstance.current = instance
  }, []);

  const handlePublish = async () => {
    if (!anchorWallet || !props.article) return;
    const savedHeaderContent = await headerInstance.current?.save();
    const savedContent = await editorInstance.current?.save();
    if (!savedHeaderContent || !savedContent || !signMessage) return;
    const signature = await getUserSignature(signMessage);
    if (!signature) return;
    const addedBlocks = [...savedHeaderContent.blocks, ...savedContent.blocks];
    const payload = {
      content: {
        blocks: addedBlocks
      },
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
      error: 'Publishing Failed! Trying again...'
    });
    const txid = await postTransaction;
    if (!txid) return;
    console.log(`TXID: ${txid}`);
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
                blocks={headingBlocks}
                handleInstance={handleHeaderEditorInit}
              />
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
