import noArticles from '@/images/elements/no-articles.svg';
import publishNew from '@/images/elements/publish-new-article.svg';
import styles from './Dashboard.module.scss';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useWallet } from '@solana/wallet-adapter-react';
import { Footer } from '../components/Footer';
import { DefaultHead } from '../components/DefaultHead';
import { Navbar } from '../components/Navbar';
import { DefaultBox } from '@/elements/Box';
import { getTrimmedPublicKey } from '@/lib/getTrimmedPublicKey';
import { DashboardSSR } from '@/types/props';
import { VerticalArticlePreview } from '../components/ArticlePreview';

export const NoArticles = () => (
  <div className="flex justify-content-center mt-12">
    <img className={styles.noArticlesImage} src={noArticles.src} alt="No published articles" />
  </div>
);

export const DashboardPage = (
  props: DashboardSSR
) => {
  const router = useRouter();
  const { publicKey } = useWallet();

  const replaceTab = (tab: string) => {
    router.replace(`/dashboard/${publicKey?.toString()}/${tab}`);
  }

  const getActiveTabClassname = (tab: string) => {
    const activeTab = router.asPath.includes(tab);
    return activeTab ? 'subheading' : 'light-sub-heading';
  }

  useEffect(() => {
    if (!publicKey || publicKey.toString() !== router.query.publicKey) {
      router.push('/')
    }
  }, [])

  return (
    <div className="container-flex">
      <div className="max-width">
        <DefaultHead title={`Welcome ${props.user?.name}`} />
        <Navbar />
        <div className="main-padding">
          <div className={styles.heroSection}>
            <DefaultBox>
              <div
                className="flex align-items-center justify-content-center height-100 pointer"
                onClick={() => router.push('/new')}>
                <img className={styles.publishImage} src={publishNew.src} alt="Publish New Article" />
              </div>
            </DefaultBox>
            <DefaultBox>
              <div className="flex column align-items-start justify-space-between height-100">
                <div className="flex">
                  <img className="avatar sm" src={props.user?.image_url} alt="Avatar" />
                  <div>
                    <p className="subheading xs nm ml-2 mt-1">{props.user?.name}</p>
                    <p className="subheading xs nm ml-2 light">{getTrimmedPublicKey(
                      props.user?.public_key || ''
                    )}</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/${props.user?.username}`)}
                  style={{
                    height: '4.2rem',
                    fontSize: '1.6rem'
                  }} className="gray-btn mt-1-5">View Profile</button>
              </div>
            </DefaultBox>
          </div>
          <div className={styles.heading}>
            <p onClick={() => replaceTab('published')} className={`${getActiveTabClassname('published')} mxs bold pointer`}>Published</p>
            <p onClick={() => replaceTab('drafts')} className={`${getActiveTabClassname('drafts')} ml-3 mxs bold pointer`}>Drafts</p>
          </div>
          <div className={styles.articles}>
            {props.drafts && (
              <div>
                {props.drafts.map((draft) => (
                  <VerticalArticlePreview
                    key={draft.id}
                    article={draft}
                    user={props.user}
                  />
                ))}
                {props.drafts.length === 0 && (
                  <NoArticles />
                )}
              </div>
            )}
            {props.articles && (
              <div>
                {props.articles.map((article) => (
                  <VerticalArticlePreview
                    key={article.title}
                    article={article}
                    user={props.user}
                  />
                ))}
                {props.articles.length === 0 && (
                  <NoArticles />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
