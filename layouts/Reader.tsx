import Output from "editorjs-blocks-react-renderer";
// @ts-expect-error
import ImageGallery from '@rodrigoodhin/editorjs-image-gallery';

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
      }} config={READER_CONFIG} />
    </div>
  )
}

export default Reader;