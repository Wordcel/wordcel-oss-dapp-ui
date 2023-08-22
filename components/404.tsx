import styles from '@/styles/Static.module.scss';

import element from '@/images/elements/404.svg';
import pattern from '@/images/elements/pattern.svg';

import { DefaultHead } from './DefaultHead';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const NotFoundElement = () => {
  return (
    <div className="main-padding">
      <div className={styles.notFoundContainer}>
        <img
          className={styles.notFoundPattern}
          src={pattern.src}
          alt=""
        />
        <div className={styles.notFoundHeader}>
          <h1 className="text gray-700 size-36 weight-700">Error 404: Not Found</h1>
          <p className="text gray-400 size-24 weight-400">{"The page you were looking for couldn't be found."}</p>
        </div>
        <img className={styles.notFoundImage} src={element.src} alt="" />
      </div>
    </div>
  );
}

export const NotFoundPage = () => {
  return (
    <div className="container-flex">
      <DefaultHead />
      <Navbar />
      <NotFoundElement />
      {/* <Footer /> */}
    </div>
  )
}