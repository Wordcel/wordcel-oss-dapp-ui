import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import styles from '@/styles/Editor.module.scss';
import { publishPost } from '@/components/contractInteraction';
import { EditorCore } from "@react-editor-js/core";
import { GetArticleServerSide } from '@/types/props';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { useEffect, useCallback, useRef, useState } from 'react';
import { DefaultHead } from './DefaultHead';
import { StaticNavbar } from './Navbar';
import { getUserSignature } from '@/components/signMessage';
import { Footer } from './Footer';
import { uploadNFTStorage } from '@/components/upload';
import { updateCacheLink } from '@/components/cache';
import { saveToast } from '@/components/saveToast';

export const EditArticle = (props: GetArticleServerSide) => {
  const router = useRouter();
  const [blocks] = useState<any>(JSON.parse(props.blocks || ''));
  const [sigError, setSigError] = useState('');
  const [signature, setSignature] = useState<Uint8Array>();
  const { publicKey, signMessage } = useWallet();
  const anchorWallet = useAnchorWallet();
  const wallet = useWallet();

  const Editor = dynamic(() => import('@/layouts/Editor'), {
    ssr: false
  });
  const editorInstance = useRef<EditorCore | null>(null);

  const handleInitialize = useCallback((instance) => {
    editorInstance.current = instance
  }, []);

  useEffect(() => {
    (async function () {
      if (publicKey && signMessage && props.article) {
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
    const eventListener = (e: KeyboardEvent) => {
      if (e.keyCode === 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        saveToast();
      }
    }
    if (typeof window !== 'undefined') {
      document.addEventListener("keydown", eventListener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.removeEventListener("keydown", eventListener);
      }
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!editorInstance.current?.save || !props.article || !publicKey || !signature) return;
      toast('Saving...');
      const data = await editorInstance.current.save();
      const payload = {
        content: { blocks: data.blocks },
        type: 'blocks'
      };
      const cache_link = await uploadNFTStorage(payload);
      if (!cache_link) return;
      const update_cache = await updateCacheLink({
        id: props.article.id.toString(),
        cache_link: cache_link,
        signature: signature,
        public_key: publicKey.toBase58()
      });
      toast.success('Saved');
      console.log(update_cache);
    }, 30000)
    return () => {
      clearInterval(interval);
    }
  }, [signature]);

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
      wallet,
      signature,
      props.article?.id,
      true,
      props.article.proof_of_post
    );
    const response = await postTransaction;
    if (!response) {
      toast.dismiss();
      toast.error('Failed to publish article');
      return;
    };
    toast('Redirecting...');
    router.push(`/${response.username}/${response.article.slug}`);
  }

  useEffect(() => {
    if (!publicKey || publicKey.toString() !== props.user_public_key) {
      router.push('/');
    }
  }, [publicKey, props]);

  return (
    <div className="container-flex">
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
      <Footer />
    </div>
  );
};
