import { WelcomePage } from '@/layouts/WelcomePage';
import { GetServerSideProps } from 'next';
import { getArticlesServerSide } from '@/components/getArticlesServerSide';
import { GetArticlesServerSide } from '@/types/props';

const Welcome = (props: GetArticlesServerSide) => {
  return <WelcomePage {...props} />;
};

export default Welcome;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const getPropsToReturn = await getArticlesServerSide(context);
  return getPropsToReturn;
};
