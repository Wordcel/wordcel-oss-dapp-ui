import React, { useState } from 'react';
import styles from '@/styles/Dashboard.module.scss';
import { Sidebar } from './Sidebar';
import { useSidebar, useUser } from '../Context';
import { RequestConnect } from '@/elements/RequestConnect';

function MainLayout({
  children,
  noPadding
}: {
  children: React.ReactNode;
  noPadding?: boolean;
}) {
  const data = useUser();
  const sidebarState = useSidebar();

  const getPadding = () =>
  sidebarState?.collapsed ? '3.5rem 3.5rem 3.5rem 9.5rem' : '3.5rem 3.5rem 3.5rem 28.5rem'

  return (
    <div className={styles.container}>
      <Sidebar />
      <div
        style={{
          padding: noPadding ? '0rem' : getPadding()
        }}
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