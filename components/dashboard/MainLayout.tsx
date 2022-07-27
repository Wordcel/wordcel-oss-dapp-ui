import React from 'react';
import styles from '@/styles/Dashboard.module.scss';
import { Sidebar } from './Sidebar';
import { useUser } from '../Context';
import { RequestConnect } from '@/elements/RequestConnect';

function MainLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const data = useUser();
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.main}>
        {data?.user && (
          <>
            {children}
          </>
        )}
        {!data?.user && (
          <RequestConnect dashboard={true} />
        )}
      </div>
    </div>
  );
};

export { MainLayout };