import { ViewArticle } from '@/layouts/ViewArticle';
import { GetArticleServerSide } from '@/types/props';
import { getArticleServerSide } from '@/components/getArticleServerSide';
import { GetServerSideProps } from 'next';

const ViewArticlePage = (props: GetArticleServerSide) => {
  return <ViewArticle {...props} />
};

export default ViewArticlePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props = await getArticleServerSide(context);
  return props;
}