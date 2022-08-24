import Header from "@editorjs/header"
import { createReactEditorJS } from 'react-editor-js'
import { EditorCore } from "@react-editor-js/core";


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
import List from "@editorjs/list";
// @ts-expect-error
import Quote from "@editorjs/quote";
// @ts-expect-error
import MathEx from 'editorjs-math';

// // @ts-expect-error
// import { MDImporter, MDParser } from '@/external/markdown.js';

import { useWallet } from "@solana/wallet-adapter-react";

// @ts-expect-error
import Undo from 'editorjs-undo';
// @ts-expect-error
import DragDrop from 'editorjs-drag-drop';


// @ts-expect-error
import ImageGallery from '@rodrigoodhin/editorjs-image-gallery';

// @ts-expect-error
import Image from "@editorjs/image";
import { useEffect } from "react"
import { uploadImageBundlr } from "@/lib/uploadBundlr";
import { timeout } from "@/lib/utils";


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
        undo: 'CMD+Z',
        redo: 'SHIFT+Z'
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
    code: {
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
