import { DashboardPage } from '@/layouts/Dashboard';
import { GetServerSideProps } from 'next';
import { DashboardSSR } from '@/types/props';
import { getDraftsServerSide } from '@/lib/ssr/getDraftsServerSide';
import { getArticlesServerSide } from '@/lib/ssr/getArticlesServerSide';

const Dashboard = (props: DashboardSSR) => {
  return <DashboardPage {...props} />;
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const send_drafts = context.query.tab === 'drafts';
  const getPropsToReturn = send_drafts ? await getDraftsServerSide(context) : await getArticlesServerSide(context);
  return getPropsToReturn;
};
