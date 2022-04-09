import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import styles from '@/styles/Editor.module.scss';
import { publishPost } from '@/components/publishArticle';
import { EditorCore } from "@react-editor-js/core";
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { useCallback, useRef } from 'react';
import { DefaultHead } from './DefaultHead';
import { StaticNavbar } from './Navbar';
import { getUserSignature } from '@/components/signMessage';


export const NewArticle = () => {
  const router = useRouter();
  const { signMessage } = useWallet();
  const anchorWallet = useAnchorWallet();

  const Editor = dynamic(() => import('@/layouts/Editor'), {
    ssr: false
  });
  let editorInstance = useRef<EditorCore | null>(null);

  const handleInitialize = useCallback((instance) => {
    editorInstance.current = instance
  }, []);

  const handlePublish = async () => {
    if (!anchorWallet) return;
    const savedContent = await editorInstance.current?.save();
    if (!savedContent || !signMessage) return;
    const signature = await getUserSignature(signMessage);
    if (!signature) return;
    const payload = {
      content: { blocks: savedContent.blocks },
      type: 'blocks'
    };
    console.log(payload);
    const postTransaction = publishPost(
      payload,
      anchorWallet as any,
      signature,
      undefined,
      true
    );
    toast.promise(postTransaction, {
      loading: 'Publishing Article',
      success: 'Article Published Successfully!',
      error: 'Publishing Failed!'
    });
    const response = await postTransaction;
    if (!response.article) return;
    toast('Redirecting...');
    router.push(`/${response.username}/${response.article.slug}`);
  }

  return (
    <div>
      <DefaultHead title="Publish new article" />
      <StaticNavbar publish={handlePublish} />
      <div className={styles.container}>
        <div className={styles.editorMaxWidth}>
          {typeof window !== 'undefined' && (
            <div className="mb-main">
              <Editor handleInstance={handleInitialize} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
