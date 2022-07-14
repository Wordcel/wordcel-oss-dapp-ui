import Output from "editorjs-blocks-react-renderer";
// @ts-expect-error
import { ChecklistOutput, CodeBoxOutput } from 'editorjs-react-renderer';
import { ImageGalleryOutput } from "@/elements/Renderers";

const Reader = ({
  blocks
}: {
  blocks: any
}) => {
  const READER_CONFIG = {
    header: {
      className: "reader-header",
    },
    image: {
      className: "reader-image"
    },
    paragraph: {
      className: "reader-paragraph"
    },
    list: {
      className: "reader-list"
    },
    embed: {
      className: "reader-embed"
    },
    quote: {
      className: "reader-blockquote"
    },
    figure: {
      className: "reader-figure"
    }
  }
  return (
    <div id="reader" style={{
      fontSize: '170%'
    }}>
      <Output data={{
        blocks: blocks,
        version: '1',
        time: new Date().getTime(),
      }} renderers={{
        checklist: ChecklistOutput,
        code: CodeBoxOutput,
        imageGallery: ImageGalleryOutput
      }} config={READER_CONFIG} />
    </div>
  )
}

export default Reader;