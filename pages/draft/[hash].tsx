import { ViewDraft } from '@/layouts/ViewDraft';
import { GetDraftServerSide } from '@/types/props';
import { getDraftServerSide } from '@/lib/ssr/getDraftServerSide';
import { GetServerSideProps } from 'next';

const ViewDraftPage = (props: GetDraftServerSide) => {
  return <ViewDraft {...props} />
};

export default ViewDraftPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props = await getDraftServerSide(context, true);
  return props;
}