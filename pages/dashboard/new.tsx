// Component Imports
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { EditorCore } from "@react-editor-js/core";
import {
  useCallback,
  useRef,
  useState
} from 'react';
import { useRouter } from 'next/router';
import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { publishPost } from '@/lib/contractInteraction';
import { getUserSignature } from '@/lib/signMessage';
import { deleteDraft } from '@/lib/networkRequests';

// Layout Imports
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { MainLayout } from "@/components/dashboard/MainLayout";
import { DefaultHead } from "@/components/DefaultHead";
import { GetUserSignature } from '@/components/GetUserSignature';
import { AutoSaveArticle } from '@/components/AutoSave';


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
    <div>
      <DefaultHead title="Dashboard • Publish New Article" />
      <Navbar publish={handlePublish} />
      <GetUserSignature setSignature={setSignature} />
      {signature && (
        <AutoSaveArticle
          draft_id={draft_id}
          editorInstance={editorInstance}
          signature={signature}
          publishClicked={publishClicked}
        />
      )}
      <MainLayout>
        <div className="mt-5">
          <Editor handleInstance={handleInitialize} instance={editorInstance} />
        </div>
      </MainLayout>
      <Footer />
    </div>
  );
}

export default Dashboard;