import Output from "editorjs-blocks-react-renderer";
// import ImageGallery from '@rodrigoodhin/editorjs-image-gallery';
// @ts-expect-error
import { ChecklistOutput } from 'editorjs-react-renderer';

const Reader = ({
  blocks
}: {
  blocks: any
}) => {
  const READER_CONFIG = {
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
        // imageGallery: ImageGallery,
        checklist: ChecklistOutput,
        // blockquote: QuoteOutput
      }} config={READER_CONFIG} />
    </div>
  )
}

export default Reader;