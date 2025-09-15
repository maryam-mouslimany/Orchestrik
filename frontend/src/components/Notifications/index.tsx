// src/features/NotificationsModal/index.tsx
import React from 'react';
import Modal from '../../components/Modal';
import styles from './styles.module.css';
import { useNotificationsModal } from './hook';

type Props = {
  open: boolean;
  onClose: () => void;
};

const NotificationsModal: React.FC<Props> = ({ open, onClose }) => {
  const { items, loading, error, markRead } = useNotificationsModal(open);

  return (
    <Modal open={open} onClose={onClose} title="Notifications" size="sm">
      <div className={styles.container}>
        {loading && <div className={styles.state}>Loading...</div>}
        {!loading && error && <div className={styles.error}>{error}</div>}
        {!loading && !error && !items.length && (
          <div className={styles.state}>No unread notifications.</div>
        )}

        {items.map((n) => (
          <div key={n.id} className={styles.item}>
            <div className={styles.row}>
              <div className={styles.content}>
                <div className={styles.title}>{n.data?.title ?? 'Notification'}</div>
                <div className={styles.sub}>
                  Task: <strong>{n.data?.payload?.task_title ?? '—'}</strong> ·
                  Project: <strong>{n.data?.payload?.project_title ?? '—'}</strong>
                </div>
                <div className={styles.time}>
                  {new Date(n.created_at).toLocaleString()}
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.markBtn}
                  onClick={async () => {
                    try {
                      await markRead(n.id);
                    } catch (e) {
                      console.error('markRead failed', e);
                      // Optional: show a toast if you have one
                    }
                  }}
                >
                  Mark as read
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default NotificationsModal;
