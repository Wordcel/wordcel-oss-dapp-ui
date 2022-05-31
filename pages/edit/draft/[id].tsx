import { getDraftServerSide } from '@/components/ssr/getDraftServerSide';
import { EditDraft } from '@/layouts/EditDraft';
import { GetDraftServerSide } from '@/types/props';
import { GetServerSideProps } from 'next';

const EditDraftPage = (props: GetDraftServerSide) => {
  return <EditDraft {...props} />
};

export default EditDraftPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props = await getDraftServerSide(context);
  return props;
};
