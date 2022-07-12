import Lottie from "react-lottie";
import animation from '@/components/animations/json/loading.json';

const Loading = ({
  width, height
}: { width: number | string, height: number | string }) => {
  const options = {
    animationData: animation,
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return <Lottie
    options={options}
    width={width}
    height={height}
    isClickToPauseDisabled={true}
  />
};

export { Loading };
