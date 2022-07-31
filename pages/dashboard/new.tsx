// Component Imports
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import {
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react';
import { useRouter } from 'next/router';
import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { publishPost } from '@/lib/contractInteraction';
import { getUserSignature } from '@/lib/signMessage';
import { deleteDraft, updateDraft } from '@/lib/networkRequests';
import { EditorCore } from '@react-editor-js/core';

// Layout Imports
import { Footer } from "@/components/Footer";
import { EditorNavbar } from "@/components/Navbar";
import { MainLayout } from "@/components/dashboard/MainLayout";
import { DefaultHead } from "@/components/DefaultHead";


function Dashboard() {
  const router = useRouter();
  const wallet = useWallet();
  const anchorWallet = useAnchorWallet();
  const { publicKey, signMessage } = useWallet();
  const Editor: any = dynamic(() => import('@/components/Editor'), {
    ssr: false
  });
  const editorInstance = useRef<EditorCore | null>(null);
  const handleInitialize = useCallback((instance) => {
    editorInstance.current = instance
  }, []);
  const [signature, setSignature] = useState<Uint8Array>();

  let [draft_id] = useState('');
  let [publishClicked] = useState(false);

  const shareHash = useRef("");
  const saveText = useRef("");

  const handlePublish = async () => {
    if (!anchorWallet || publishClicked) return;
    publishClicked = true;
    const currentInstance = editorInstance.current;
    const savedContent = await currentInstance?.save();
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
  };

  // Get User's Signature for auto saving drafts
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

  // Auto save the draft
  useEffect(() => {
    const interval = setInterval(async () => {
      console.log('this is running');
      const currentInstance = editorInstance.current;
      if (!currentInstance || !publicKey || !signature) return;
      if (saveText.current !== 'Saved' ) saveText.current = 'Saving...';
      const data = await currentInstance?.save();
      const response = await updateDraft({
        id: draft_id,
        blocks: data.blocks,
        signature: signature,
        public_key: publicKey.toBase58()
      });
      console.log(response);
      if (response?.draft?.id) draft_id = response.draft.id;
      if (response?.draft?.share_hash) shareHash.current = response.draft.share_hash;
      saveText.current = 'Saved';
    }, 8000);
    return () => {
      clearInterval(interval);
    }
  }, [signature]);

  const onChangeNotSavedText = () => {
    saveText.current = 'Waiting to save';
  }

  return (
    <div>
      <DefaultHead title="Dashboard • Publish New Article" />
      <EditorNavbar
        handlePublish={handlePublish}
        parentSaveText={saveText}
        parentShareHash={shareHash}
      />
      <MainLayout>
        <div className="mt-5">
          <Editor
            handleInitialize={handleInitialize}
            instance={editorInstance}
            onChange={onChangeNotSavedText}
          />
        </div>
      </MainLayout>
      <Footer />
    </div>
  );
}

export default Dashboard;