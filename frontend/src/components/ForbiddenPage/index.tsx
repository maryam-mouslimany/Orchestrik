import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { useAuth } from '../../contexts/AuthContext';
import { roleHome } from '../../constants/constants';

const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const role = String(user?.role?.name || '').toLowerCase();
  const mapped = roleHome[role] || '/';
  const homePath = mapped.startsWith('/') ? mapped : `/${mapped}`; 

  return (
    <main className={styles.wrapper} aria-labelledby="forbidden-title">
      <div className={styles.bg403} aria-hidden="true">403</div>

      <section className={styles.content}>
        <h1 id="forbidden-title" className={styles.title}>
          You’re not permitted to see this.
        </h1>

        <p className={styles.subtitle}>
          The page you’re trying to access has restricted access.
          If you believe this is a mistake, contact your admin.
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primary}
            onClick={() => navigate(homePath, { replace: true })}
          >
            Return to {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Home'}
          </button>

          <button
            type="button"
            className={styles.ghost}
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </section>
    </main>
  );
};

export default ForbiddenPage;
