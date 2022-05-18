import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import styles from '@/styles/Editor.module.scss';
import { publishPost } from '@/components/contractInteraction';
import { EditorCore } from "@react-editor-js/core";
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { useEffect, useCallback, useRef, useState } from 'react';
import { DefaultHead } from './DefaultHead';
import { StaticNavbar } from './Navbar';
import { getUserSignature } from '@/components/signMessage';
import { uploadNFTStorage } from '@/components/upload';
import { createNewCache } from '@/components/cache';
import { Footer } from './Footer';


export const NewArticle = () => {
  const router = useRouter();
  const { publicKey, signMessage } = useWallet();
  const [articleId, setArticleId] = useState('');
  const [sigError, setSigError] = useState('');
  const [signature, setSignature] = useState<Uint8Array>();
  const anchorWallet = useAnchorWallet();
  const wallet = useWallet();

  const Editor = dynamic(() => import('@/layouts/Editor'), {
    ssr: false
  });
  let editorInstance = useRef<EditorCore | null>(null);

  const handleInitialize = useCallback((instance) => {
    editorInstance.current = instance
  }, []);

  useEffect(() => {
    (async function () {
      if (publicKey && signMessage) {
        const userSignature = await getUserSignature(signMessage);
        if (!userSignature) {
          toast('Please sign the message on your wallet so that we can save your progress');
          setSigError(`Error: ${Math.random()}`)
          return;
        };
        setSignature(userSignature);
      }
    })();
  }, [sigError]);

  useEffect(() => {
    setInterval(async () => {
      if (!editorInstance.current || !publicKey || !signature) return;
      toast('Saving...')
      const data = await editorInstance.current.save();
      const payload = {
        content: { blocks: data.blocks },
        type: 'blocks'
      };
      const cache_link = await uploadNFTStorage(payload);
      if (!cache_link) return;
      const update_cache = await createNewCache({
        id: articleId,
        cache_link: cache_link,
        signature: signature,
        public_key: publicKey.toBase58()
      });
      console.log(update_cache);
      setArticleId(update_cache.article.id.toString());
    }, 30000)
  }, [signature]);

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
      wallet,
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
              <Editor handleInstance={handleInitialize} />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
