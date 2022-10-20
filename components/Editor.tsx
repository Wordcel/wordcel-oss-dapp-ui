import { createReactEditorJS } from 'react-editor-js'
import { EditorCore } from "@react-editor-js/core";

import Header from "@editorjs/header"
// @ts-expect-error
import Paragraph from '@editorjs/paragraph';
// @ts-expect-error
import CheckList from "@editorjs/checklist";
import CodeBox from "@/components/plugins/CodeBox";
// @ts-expect-error
import Delimiter from "@editorjs/delimiter";
// @ts-expect-error
import Embed from "@editorjs/embed";
// @ts-expect-error
import InlineCode from "@editorjs/inline-code";
// @ts-expect-error
import List from "@editorjs/list";
// @ts-expect-error
import Quote from "@editorjs/quote";
// @ts-expect-error
import MathEx from 'editorjs-math';
// @ts-expect-error
import Undo from 'editorjs-undo';
// @ts-expect-error
import DragDrop from 'editorjs-drag-drop';
// @ts-expect-error
import ImageGallery from '@rodrigoodhin/editorjs-image-gallery';
// @ts-expect-error
import Image from "@editorjs/image";

// // @ts-expect-error
// import { MDImporter, MDParser } from '@/external/markdown.js';

import { getUserSignature } from '@/lib/signMessage';
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";

import { useEffect } from "react"
import { timeout } from "@/lib/utils";
import toast from 'react-hot-toast';
import { uploadUsingURL } from '@/lib/networkRequests';


interface Editor {
  handleInitialize: (instance: any) => void;
  blocks?: any[];
  onChange?: () => void;
  instance: EditorCore | null;
}

const allowLinks = (
  element: any
) => {
  try {
    Object.defineProperty(element, 'sanitize',  {
      get() {
        return {
          text: { a: true },
          items: { a: true }
        };
      }
    });
  } catch (e) {
    console.log(e);
  }
}

const getUserSig = async (wallet: WalletContextState) => {
  const { signMessage } = wallet;
  if (!signMessage || !wallet.publicKey) return;
  const signature = await getUserSignature(signMessage, wallet.publicKey.toBase58());
  return signature;
}

async function uploadImage(
  file: File,
  wallet: WalletContextState
) {
  let uploadedURL = '';
  return new Promise (async (resolve, reject) => {
    if (!wallet.publicKey) return;
    const signature = await getUserSig(wallet);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('public_key', wallet.publicKey?.toBase58());
    formData.append('signature', JSON.stringify(signature));

    const response = await fetch(
      'https://wordcel.up.railway.app/upload',
      // 'http://localhost:8000/upload',
    {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    if (data.url) {
      uploadedURL = data.url;
      resolve(data.url);
    } else {
      toast.error(data.error);
      reject(data.error);
    }

  }).then(() => {
    return uploadedURL ? {
      success: 1,
      file: { url: uploadedURL }
    } : {
      success: 0,
      error: 'Error uploading image'
    }
  });
}

const CustomEditor = ({
  blocks,
  onChange,
  handleInitialize,
  instance
}: Editor) => {

  const wallet = useWallet();
  const Editor = createReactEditorJS();

  useEffect(() => {
    const toAllowLinks = [Paragraph, List, Header, InlineCode, Quote, Embed];
    toAllowLinks.forEach((link) => allowLinks(link));
  }, []);

  const handleReady = async () => {
    // @ts-expect-error
    const editor = instance?.current?._editorJS;
    const config = {
      shortcuts: {
        undo: 'CMD+Z'
      }
    }
    try {
      new Undo({ editor, config })
      new DragDrop(editor);
    }
    catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    (async function () {
      await timeout(4000);
      handleReady();
    })();
  }, []);

  const EDITOR_JS_TOOLS = {
    embed: {
      class: Embed,
      inlineToolbar: true
    },
    header: {
      class: Header,
      shortcut: "CMD+SHIFT+H",
      levels: [1, 2, 3, 4, 5, 6],
      defaultLevel: 1,
      inlineToolbar: ['link', 'bold', 'italic'],
    },
    image: {
      class: Image,
      shortcut: "CMD+SHIFT+I",
      config: {
        uploader: {
          uploadByFile(file: File) {
            const allowed_extensions = ['png', 'jpg', 'jpeg', 'gif'];
            if (file.size > 8e+6) {
              toast.error('Please select an image less than 8MB');
              return { success: 0, error: 'Error uploading image' };
            }
            const file_extension = file.name.split('.').pop();
            if (!file_extension) {
              toast.error('Please select a valid file');
              return { success: 0, error: 'Error uploading image' };
            }
            if (!allowed_extensions.includes(file_extension)) {
              toast.error('File type is not supported');
              return { success: 0, error: 'Error uploading image' };
            }
            return uploadImage(file, wallet);
          },
          async uploadByUrl(url: string) {
            const signature = await getUserSig(wallet);
            if (!wallet.publicKey || !signature) return;
            const uploaded = await uploadUsingURL(wallet.publicKey.toBase58(), signature, url);
            if (uploaded) {
              return {
                success: 1,
                file: { url: uploaded }
              }
            }
          }
        }
      }
    },
    list: {
      class: List,
      shortcut: "CMD+SHIFT+L",
      inlineToolbar: ['link', 'bold', 'italic'],
    },
    math: {
      class: MathEx
    },
    paragraph: {
      class: Paragraph,
      inlineToolbar: ['link', 'bold', 'italic'],
    },
    codebox: {
      class: CodeBox,
      shortcut: "CMD+SHIFT+C",
    },
    quote: {
      class: Quote,
      shortcut: "CMD+SHIFT+Q",
    },
    checklist: {
      class: CheckList,
      shortcut: "CMD+SHIFT+K",
    },
    delimiter: {
      class: Delimiter,
      shortcut: "CMD+SHIFT+D",
    },
    inlineCode: {
      class: InlineCode
    },
    imageGallery: ImageGallery,
    // markdownImporter: MDImporter,
  }

  return (
    <div style={{ fontSize: '170%' }}>
      <Editor
        holder='editor'
        onInitialize={(instance: any) => handleInitialize(instance)}
        // @ts-expect-error
        tools={EDITOR_JS_TOOLS}
        placeholder={`Start writing from here`}
        // @ts-expect-error
        defaultValue={{ blocks }}
        onChange={onChange}
      />
      <div id='editor' />
    </div>
  );
}

export default CustomEditor;
