import Header from "@editorjs/header"
import { createReactEditorJS} from 'react-editor-js'

// @ts-expect-error
import Paragraph from '@editorjs/paragraph';
// @ts-expect-error
import CheckList from "@editorjs/checklist";
// @ts-expect-error
import CodeBox from "@bomdi/codebox";
// @ts-expect-error
import Delimiter from "@editorjs/delimiter";
// @ts-expect-error
import Embed from "@editorjs/embed";
// @ts-expect-error
import InlineCode from "@editorjs/inline-code";
// @ts-expect-error
import LinkTool from "@editorjs/link";
// @ts-expect-error
import List from "@editorjs/list";
// @ts-expect-error
import Quote from "@editorjs/quote";

// // @ts-expect-error
// import { MDImporter, MDParser } from '@/external/markdown.js';

import { useWallet } from "@solana/wallet-adapter-react";

// // @ts-expect-error
// import ImageGallery from '@rodrigoodhin/editorjs-image-gallery';

// @ts-expect-error
import Image from "@editorjs/image";
import { useEffect } from "react"
import { uploadImageBundlr } from "@/components/uploadBundlr";

interface Editor {
  handleInstance: (instance: any) => void;
  blocks?: any[];
  onChange?: () => void;
  handleReady?: () => void;
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

const CustomEditor = ({
  handleInstance,
  blocks,
  onChange,
  handleReady
}: Editor) => {

  const wallet = useWallet();

  useEffect(() => {
    const toAllowLinks = [Paragraph, List, Header, InlineCode, Quote, Embed];
    toAllowLinks.forEach((link) => allowLinks(link));
  }, []);

  const Editor = createReactEditorJS();

  const EDITOR_JS_TOOLS = {
    embed: Embed,
    image: {
      class: Image,
      config: {
        uploader: {
          uploadByFile(file: File) {
            let uploadedURL = '';
            return new Promise (async (resolve, reject) => {
              const url = await uploadImageBundlr(file, wallet);
              if (url) {
                uploadedURL = url;
                resolve(uploadedURL);
              } else reject(new Error('Upload failed'));
            }).then(() => {
              if (uploadedURL) {
                return {
                  success: 1,
                  file: {
                    url: uploadedURL
                  }
                }
              } else {
                return {
                  success: 0,
                  error: 'Error uploading image'
                }
              }
            })
          }
        }
      }
    },
    header: {
      class: Header,
      inlineToolbar: ['link', 'bold', 'italic'],
    },
    list: {
      class: List,
      inlineToolbar: ['link', 'bold', 'italic'],
    },
    paragraph: {
      class: Paragraph,
      inlineToolbar: ['link', 'bold', 'italic'],
    },
    code: CodeBox,
    linkTool: LinkTool,
    quote: Quote,
    checklist: CheckList,
    delimiter: Delimiter,
    inlineCode: InlineCode,
    // markdownImporter: MDImporter,
    // imageGallery: ImageGallery,
  }

  return (
    <div style={{ fontSize: '170%' }}>
      <Editor
        holder='editor'
        onInitialize={(instance: any) => handleInstance(instance)}
        // @ts-expect-error
        tools={EDITOR_JS_TOOLS}
        placeholder={`Write from here...`}
        // @ts-expect-error
        defaultValue={{ blocks }}
        onChange={onChange}
        onReady={handleReady}
      />
      <div id='editor' />
    </div>
  );
}

export default CustomEditor;
