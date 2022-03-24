import Header from "@editorjs/header"
import { createReactEditorJS } from 'react-editor-js'
// @ts-expect-error
import Paragraph from '@editorjs/paragraph';
// @ts-expect-error
import CheckList from "@editorjs/checklist";
// @ts-expect-error
import Raw from "@editorjs/raw";
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
// @ts-expect-error
import SimpleImage from "@editorjs/simple-image";

interface Editor {
  handleInstance: (instance: any) => void;
  blocks?: any[]
}

const CustomEditor = ({
  handleInstance,
  blocks
}: Editor) => {
  const EDITOR_JS_TOOLS = {
    embed: Embed,
    header: Header,
    list: List,
    raw: Raw,
    paragraph: Paragraph,
    paragrah: Paragraph, // please remove this in production, here now due to a typo in the blocks
    codeBox: CodeBox,
    linkTool: LinkTool,
    quote: Quote,
    checklist: CheckList,
    delimiter: Delimiter,
    inlineCode: InlineCode,
    simpleImage: SimpleImage
  }
  const EditorJS = createReactEditorJS();
  console.log(blocks);
  return (
    <div style={{ fontSize: '170%' }}>
      <EditorJS
        onInitialize={handleInstance}
        tools={EDITOR_JS_TOOLS}
        placeholder={`Write from here...`}
        defaultValue={{ blocks }}
      />
    </div>
  );
}

export default CustomEditor;
