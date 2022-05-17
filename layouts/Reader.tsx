import Output from "editorjs-blocks-react-renderer";
// @ts-expect-error
import ImageGallery from '@rodrigoodhin/editorjs-image-gallery';
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
    }
  }
  return (
    <div style={{
      fontSize: '170%'
    }}>
      <Output data={{
        blocks: blocks,
        version: '1',
        time: new Date().getTime(),
      }} renderers={{
        // imageGallery: ImageGallery,
        checklist: ChecklistOutput
      }} config={READER_CONFIG} />
    </div>
  )
}

export default Reader;