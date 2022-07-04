import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import styles from '@/styles/Editor.module.scss';
import { saveToast } from '@/components/saveToast';
import { publishPost } from '@/components/contractInteraction';
import { EditorCore } from "@react-editor-js/core";
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { useEffect, useCallback, useRef, useState } from 'react';
import { DefaultHead } from './DefaultHead';
import { StaticNavbar } from './Navbar';
import { getUserSignature } from '@/lib/signMessage';
import { deleteDraft, updateDraft } from '@/components/networkRequests';
import { Footer } from './Footer';


export const NewArticle = () => {
  const router = useRouter();
  const { publicKey, signMessage } = useWallet();
  const [signature, setSignature] = useState<Uint8Array>();

  let [draft_id] = useState('');
  let [publishClicked] = useState(false);

  const anchorWallet = useAnchorWallet();
  const wallet = useWallet();

  const Editor: any = dynamic(() => import('@/layouts/Editor'), {
    ssr: false
  });
  const editorInstance = useRef<EditorCore | null>(null);

  const handleInitialize = useCallback((instance) => {
    editorInstance.current = instance
  }, []);

  const defaultBlocks = [
    { type: 'header', data: { text: 'Enter a heading', level: 1 } },
    { type: 'paragraph', data: { text: 'Enter a sub heading' } },
    { type: 'image', data: { file: '' }}
  ];

  useEffect(() => {
    (async function () {
      if (publicKey && signMessage) {
        const userSignature = await getUserSignature(
          signMessage,
          publicKey.toBase58(),
          true
        );
        if (userSignature) setSignature(userSignature);
      }
    })();
  }, []);

  useEffect(() => {
    const eventListener = (e: KeyboardEvent) => {
      if (e.keyCode === 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        saveToast();
      }
    }
    if (typeof document !== 'undefined') {
      document.addEventListener("keydown", eventListener);
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener("keydown", eventListener);
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!editorInstance.current?.save || !publicKey || !signature || publishClicked) return;
      const data = await editorInstance.current.save();
      const response = await updateDraft({
        id: draft_id,
        blocks: data.blocks,
        signature: signature,
        public_key: publicKey.toBase58()
      });
      console.log(response);
      draft_id = response?.draft?.id;
    }, 8000);
    return () => {
      clearInterval(interval);
    }
  }, [signature]);

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

  useEffect(() => {
    if (publicKey === null) {
      router.push('/');
    } else {
      (async function () {
        const request = await fetch(`/api/user/get/${publicKey}`);
        if (!request.ok) {
          router.push('/');
        }
      })();
    }
  }, [publicKey]);

  return (
    <div className="container-flex">
      <DefaultHead title="Publish new article" />
      <StaticNavbar publish={handlePublish} />
      <div className={styles.container}>
        <div className={styles.editorMaxWidth}>
          {typeof window !== 'undefined' && (
            <div className="mb-main">
              <Editor
                blocks={defaultBlocks}
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
