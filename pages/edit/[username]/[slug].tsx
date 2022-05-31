import { EditArticle } from '@/layouts/EditArticle';
import { GetArticleServerSide } from '@/types/props';
import { getArticleServerSide } from '@/components/ssr/getArticleServerSide';
import { GetServerSideProps } from 'next';

const EditArticlePage = (props: GetArticleServerSide) => {
  return <EditArticle {...props} />
};

export default EditArticlePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props = await getArticleServerSide(context);
  return props;
}