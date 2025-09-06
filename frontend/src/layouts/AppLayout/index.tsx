import * as React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './styles.module.css';
import Sidebar from '../../components/Sidebar';

export const AppLayout: React.FC = () => (
  <div className={styles.shell}>
    <Sidebar />
    <div className={styles.right}>
      <header className={styles.header}>
        {/* put your header component/content here */}
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  </div>
);
