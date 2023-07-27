import { UserView } from '@/screens/UserView';
import { GetServerSideProps } from 'next';
import { getUserServerSide } from '@/lib/ssr/getUserServerSide';
import { GetUserServerSide } from '@/types/props';


const Home = (props: GetUserServerSide) => {
  return <UserView {...props} />;
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const getPropsToReturn = await getUserServerSide(
    context,
    true,
    true,
    true,
  );
  return getPropsToReturn;
}
