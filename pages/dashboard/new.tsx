// Component Imports
import dynamic from 'next/dynamic';
import { EditorCore } from "@react-editor-js/core";
import {
  useEffect,
  useCallback,
  useRef,
  useState
} from 'react';

// Layout Imports
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { MainLayout } from "@/components/dashboard/MainLayout";
import { DefaultHead } from "@/components/DefaultHead";

function Dashboard() {
  const Editor: any = dynamic(() => import('@/components/Editor'), {
    ssr: false
  });
  const editorInstance = useRef<EditorCore | null>(null);
  const handleInitialize = useCallback((instance) => {
    editorInstance.current = instance
  }, []);

  return (
    <div>
      <DefaultHead title="Dashboard • Publish New Article" />
      <Navbar />
      <MainLayout>
        <div className="mt-5">
          <Editor
            handleInstance={handleInitialize}
            instance={editorInstance}
          />
        </div>
      </MainLayout>
      <Footer />
    </div>
  );
}

export default Dashboard;