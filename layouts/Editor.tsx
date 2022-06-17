import Header from "@editorjs/header"
import EditorJS from '@appigram/react-editor-js'

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

// import ImageGallery from '@rodrigoodhin/editorjs-image-gallery';

// @ts-expect-error
import SimpleImage from "@editorjs/simple-image";
import { useEffect } from "react"

interface Editor {
  handleInstance: (instance: any) => void;
  blocks?: any[];
  onChange?: () => void;
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
  onChange
}: Editor) => {

  useEffect(() => {
    const toAllowLinks = [Paragraph, List, Header, InlineCode, Quote, Embed];
    toAllowLinks.forEach((link) => allowLinks(link));
  }, [])

  const EDITOR_JS_TOOLS = {
    embed: Embed,
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
    // imageGallery: ImageGallery,
    image: SimpleImage
  }

  return (
    <div style={{ fontSize: '170%' }}>
      <EditorJS
        holder='editor'
        editorInstance={(instance: any) => handleInstance(instance)}
        // @ts-expect-error
        tools={EDITOR_JS_TOOLS}
        placeholder={`Write from here...`}
        // @ts-expect-error
        data={{ blocks }}
        onChange={onChange}
      />
      <div id='editor' />
    </div>
  );
}

export default CustomEditor;
