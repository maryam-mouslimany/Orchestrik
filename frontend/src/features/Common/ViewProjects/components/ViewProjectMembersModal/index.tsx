import React from 'react';
import { useProjectMembers } from './hook';
import styles from './styles.module.css';
import Modal from '../../../../../components/Modal';

type Props = {
  projectId: number | null;
  open: boolean;
  onClose: () => void;
};

const ViewProjectMembersModal: React.FC<Props> = ({ projectId, open, onClose }) => {
  const { loading, members, error } = useProjectMembers(projectId, open);

  return (
    <Modal open={open} onClose={onClose} title="Project Members" size="md">
      <div className={styles.body}>
        {loading && <div className={styles.state}>Loading members…</div>}
        {error && !loading && <div className={styles.error}>{error}</div>}
        {!loading && !error && members.length === 0 && (
          <div className={styles.state}>No members found for this project.</div>
        )}

        {!loading && !error && members.length > 0 && (
          <ul className={styles.list} role="list">
            {members.map((m) => (
              <li key={m.id} className={styles.card}>
                <div className={styles.headerRow}>
                  <div className={styles.name}>{m.name}</div>
                  {m.position && <div className={styles.position}>{m.position}</div>}
                </div>
                {m.skills?.length > 0 && (
                  <div className={styles.skillsRow} aria-label="Skills">
                    {m.skills.map((s) => (
                      <span key={s.id} className={styles.skillPill}>{s.name}</span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
};

export default ViewProjectMembersModal;
