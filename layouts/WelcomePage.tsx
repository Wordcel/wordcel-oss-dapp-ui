import { useRouter } from 'next/router';
import { GetArticlesServerSide } from '@/types/props';
import { DefaultHead } from './DefaultHead';
import { StaticNavbar } from './Navbar';
import { DefaultBox } from '@/elements/Box';
import publishNew from '@/images/elements/publish-new-article.svg';
import importArticles from '@/images/elements/import-articles.svg';
import styles from '@/styles/Welcome.module.scss';
import { getTrimmedPublicKey } from '@/components/getTrimmedPublicKey';

export const WelcomePage = (
  props: GetArticlesServerSide
) => {
  const router = useRouter();
  console.log(props)
  return (
    <div className="max-width">
      <DefaultHead title={`Welcome ${props.user?.name}`} />
      <StaticNavbar />
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
              <img src={importArticles.src} alt="Import Articles" />
              <input type="text" disabled={true} placeholder="Article / Blog URL" className="gray-input" />
              <button
                onClick={() => router.push(`/import/${props.user?.public_key}`)}
                style={{
                  height: '4.2rem',
                  fontSize: '1.6rem'
                }} className="main-btn">Import</button>
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
      </div>
    </div>
  );
};
