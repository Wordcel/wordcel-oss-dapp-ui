import React from 'react';
import styles from '@/styles/Dashboard.module.scss';
import { Sidebar } from './Sidebar';
import { useUser } from '../Context';
import { RequestConnect } from '@/elements/RequestConnect';

function MainLayout({
  children,
  noPadding
}: {
  children: React.ReactNode;
  noPadding?: boolean;
}) {
  const data = useUser();
  return (
    <div className={styles.container}>
      <Sidebar />
      <div
        style={{ padding: noPadding ? '0rem' : '3.5rem' }}
        className={styles.main}
      >
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