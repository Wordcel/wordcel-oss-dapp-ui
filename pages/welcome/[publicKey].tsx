import { WelcomePage } from "@/layouts/WelcomePage";
import { GetServerSideProps } from 'next';
import { getUserServerSide } from '@/components/getUserServerSide';
import { GetUserServerSide } from '@/types/props';

const Welcome = (props: GetUserServerSide) => {
  return <WelcomePage user={props.user} />;
};

export default Welcome;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const getPropsToReturn = await getUserServerSide(context);
  return getPropsToReturn;
}