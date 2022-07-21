import React from 'react';
import styles from '@/styles/Dashboard.module.scss';
import { Sidebar } from './Sidebar';

function MainLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.main}>
        {children}
      </div>
    </div>
  );
};

export { MainLayout };