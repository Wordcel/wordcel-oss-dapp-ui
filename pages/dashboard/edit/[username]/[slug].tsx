// Component Imports
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { EditorCore } from "@react-editor-js/core";
import {
  useCallback,
  useRef,
  useState,
  useEffect,
} from 'react';
import { useRouter } from 'next/router';
import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { publishPost } from '@/lib/contractInteraction';
import { getUserSignature } from '@/lib/signMessage';

// SSR
import { GetArticleServerSide } from '@/types/props';
import { getArticleServerSide } from '@/lib/ssr/getArticleServerSide';
import { GetServerSideProps } from 'next';

// Layout Imports
import { Navbar } from "@/components/Navbar";
import { MainLayout } from "@/components/dashboard/MainLayout";
import { DefaultHead } from "@/components/DefaultHead";
import { useUser } from '@/components/Context';


function Dashboard(props: GetArticleServerSide) {
  const userData = useUser();
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
  const [blocks] = useState<any>(JSON.parse(props.blocks || ''));

  let [publishClicked] = useState(false);

  useEffect(() => {
    if (props.user?.public_key && userData?.user?.public_key) {
      if (props.user.public_key !== userData.user.public_key) {
        router.push('/dashboard');
      }
    }
  }, [userData, props]);

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
      anchorWallet,
      wallet,
      signature,
      props.article?.id,
      true,
      props.article?.proof_of_post,
      props.contentDigest
    );
    if (!response.article) return;
    toast('Redirecting...');
    router.push(`/${response.username}/${response.article.slug}`);
  };

  return (
    <div>
      <DefaultHead title="Dashboard • Edit Article" />
      <Navbar publish={handlePublish} />
      <MainLayout>
        <div className="mt-5">
          <Editor
            blocks={blocks}
            handleInitialize={handleInitialize}
            instance={editorInstance}
          />
        </div>
      </MainLayout>
    </div>
  );
}

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props = await getArticleServerSide(context);
  return props;
};