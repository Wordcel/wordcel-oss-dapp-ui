import { UserView } from '@/layouts/UserView';
import { GetServerSideProps } from 'next';
import { getUserServerSide } from '@/components/getUserServerSide';
import { GetUserServerSide } from '@/types/props';

const UserViewPage = (props: GetUserServerSide) => {
  return <UserView {...props} />
};

export default UserViewPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const getPropsToReturn = await getUserServerSide(
    context,
    true,
    true,
    true,
  );
  return getPropsToReturn;
}