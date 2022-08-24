import { ReactPhotoCollage } from "react-photo-collage";
import MathJax from 'react-mathjax';

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