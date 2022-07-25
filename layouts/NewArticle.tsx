import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import styles from '@/styles/Editor.module.scss';
import { saveToast } from '@/lib/saveToast';
import { publishPost } from '@/lib/contractInteraction';
import { EditorCore } from "@react-editor-js/core";
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { useEffect, useCallback, useRef, useState } from 'react';
import { DefaultHead } from '../components/DefaultHead';
import { Navbar } from '../components/Navbar';
import { getUserSignature } from '@/lib/signMessage';
import { deleteDraft, updateDraft } from '@/lib/networkRequests';
import { Footer } from '../components/Footer';


export const NewArticle = () => {
  const router = useRouter();
  const { publicKey, signMessage } = useWallet();
  const [signature, setSignature] = useState<Uint8Array>();

  let [draft_id] = useState('');
  let [publishClicked] = useState(false);

  const anchorWallet = useAnchorWallet();
  const wallet = useWallet();

  const Editor: any = dynamic(() => import('@/components/Editor'), {
    ssr: false
  });
  const editorInstance = useRef<EditorCore | null>(null);

  const handleInitialize = useCallback((instance) => {
    editorInstance.current = instance
  }, []);

  const handlePublish = async () => {
    if (!anchorWallet || publishClicked) return;
    publishClicked = true;
    const savedContent = await editorInstance.current?.save();
    if (!savedContent || !signMessage || !publicKey) return;
    const signature = await getUserSignature(signMessage, publicKey.toBase58());
    if (!signature) return;
    const payload = {
      content: { blocks: savedContent.blocks },
      type: 'blocks'
    };
    console.log(payload);
    const response = await publishPost(
      payload,
      anchorWallet as any,
      wallet,
      signature,
      undefined,
      true
    );
    deleteDraft({
      id: draft_id?.toString(),
      signature: signature,
      public_key: wallet.publicKey?.toBase58()
    });
    if (!response.article) return;
    toast('Redirecting...');
    router.push(`/${response.username}/${response.article.slug}`);
  }

  return (
    <div className="container-flex">
      <DefaultHead title="Publish new article" />
      <Navbar publish={handlePublish} />
      <div className={styles.container}>
        <div className={styles.editorMaxWidth}>
          {typeof window !== 'undefined' && (
            <div className="mb-main">
              <Editor
                handleInstance={handleInitialize}
                instance={editorInstance}
              />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
