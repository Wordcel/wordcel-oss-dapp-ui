import { getArticlesServerSide } from "@/components/getArticlesServerSide";
import { ImportArticles } from "archived/ImportArticles";
import { GetArticlesServerSide } from "@/types/props";
import { GetServerSideProps } from "next";

const ImportPage = (props: GetArticlesServerSide) => {
  return <ImportArticles
    user={props.user}
    articles={props.articles}
  />;
};

export default ImportPage;

export const getServerSideProps: GetServerSideProps = async (
  context
) => {
  const props = await getArticlesServerSide(context);
  return props;
};
