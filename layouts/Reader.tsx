// @ts-expect-error
import Output from 'editorjs-react-renderer';

const Reader = ({
  blocks
}: {
  blocks: any[]
}) => {
  return (
    <div style={{ fontSize: '170%' }}>
      <Output data={{ blocks }} />
    </div>
  )
}

export default Reader;