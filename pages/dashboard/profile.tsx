import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { MainLayout } from "@/components/dashboard/MainLayout";
import { DefaultHead } from "@/components/DefaultHead";
import { useEffect, useState } from "react";
import { User, Article } from "@/types/props";
import { getUser, getAllArticles } from "@/lib/networkRequests";
import { useUser } from "@/components/Context";
import { UserProfile } from "@/layouts/UserView";
import { Loading } from "@/components/animations/Loading";
import { EditProfile } from "@/elements/EditProfile";

function Dashboard() {
  const data = useUser();
  const [user, setUser] = useState<User>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [userLoading, setUserLoading] = useState(true);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [editModal, showEditModal] = useState(false);

  const props = {
    user,
    articles,
    post_count: articles.length
  }

  const editProfile = {
    owner: user?.public_key,
    edit: () => showEditModal(true)
  }

  useEffect(() => {
    (async function () {
      if (!data?.user?.public_key) return;
      const _user = await getUser(data.user.public_key);
      console.log(_user);
      if (_user) setUser(_user as User);
      setUserLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async function () {
      if (!data?.user?.public_key) return;
      const _articles = await getAllArticles(data.user.public_key);
      if (_articles) setArticles(_articles);
      setArticlesLoading(false);
    })();
  }, []);

  return (
    <div>
      <DefaultHead title="Dashboard" />
      <Navbar editProfile={editProfile} />
      {data?.user && (
        <EditProfile
          defaultData={data.user}
          isOpen={editModal}
          setIsOpen={showEditModal}
        />
      )}
      <MainLayout noPadding={true}>
        {(user && !userLoading && !articlesLoading) && (
          <UserProfile props={props} />
        )}
        {(userLoading || articlesLoading) && (
          <div className="mt-8">
            <Loading width={200} height={200} />
          </div>
        )}
      </MainLayout>
      <Footer />
    </div>
  );
}

export default Dashboard;