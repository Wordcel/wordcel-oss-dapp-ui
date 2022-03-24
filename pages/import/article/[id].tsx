import { ImportSingleArticle } from '@/layouts/ImportSingleArticle';
import { GetArticleServerSide } from '@/types/props';
import { getArticleServerSide } from '@/components/getArticleServerSide';
import { GetServerSideProps } from 'next';

const ImportSinglePage = (props: GetArticleServerSide) => {
  return <ImportSingleArticle {...props} />
};

export default ImportSinglePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props = await getArticleServerSide(context);
  return props;
}