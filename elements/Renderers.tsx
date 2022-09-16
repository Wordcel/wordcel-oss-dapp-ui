import styles from '@/styles/Static.module.scss';

import Embed from 'react-embed';
import MathJax from 'react-mathjax';
import { detect } from 'program-language-detector';
import { ReactPhotoCollage } from "react-photo-collage";
import { CodeBlock } from "react-code-blocks";


export const ImageGalleryOutput = (
  { data }: any
) => {
  const collageSettings = {
    width: '100%',
    height: ['20rem', '20rem'],
    layout: [2, 2],
    photos: data?.urls?.map((url: string) => ({ source: url })),
    showNumOfRemainingPhotos: true
  };
  return (
    <div className="mt-4 mb-4">
      {data?.urls?.length > 0 && (
        <ReactPhotoCollage {...collageSettings} />
      )}
    </div>
  );
}

export const MathExOutput = (
  { data }: any
) => {
  return (
    <MathJax.Provider>
      <div className="mt-2 mb-2">
        <MathJax.Node formula={data.text} />
      </div>
    </MathJax.Provider>
  );
}

export const EmbedOutput = (
  { data }: any
) => {
  return (
    <Embed url={data.source} />
  )
}

export const CodeOutput = (
  { data }: any
) => {
  console.log(data);
  return (
    <div className={styles.codeblocks}>
      <CodeBlock
        text={data.code}
        language={detect(data.code).toLowerCase()}
        showLineNumbers={true}
      />
    </div>
  );
}