import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import apiCall from '../../services/apiCallService';
import styles from './styles.module.css';

type Notification = {
  id: string;
  kind: string;
  title: string;
  payload: {
    task_title: string;
    project_title: string;
  };
  created_at: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

const NotificationsModal: React.FC<Props> = ({ open, onClose }) => {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      (async () => {
        setLoading(true);
        try {
          const res = await apiCall('/notifications', { method: 'GET', requiresAuth: true });
          setItems(res.data ?? []);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} title="Notifications" size="sm">
      <div className={styles.container}>
        {loading && <div className={styles.state}>Loading...</div>}
        {!loading && !items.length && <div className={styles.state}>No unread notifications.</div>}

        {items.map((n) => (
          <div key={n.id} className={styles.item}>
            <div className={styles.title}>{n.title}</div>
            <div className={styles.sub}>
              Task: <strong>{n.payload.task_title}</strong> · Project: <strong>{n.payload.project_title}</strong>
            </div>
            <div className={styles.time}>
              {new Date(n.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default NotificationsModal;
