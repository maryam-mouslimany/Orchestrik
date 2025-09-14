import React from 'react';
import Modal from '../../../../components/Modal';
import SelectFilter from '../../../../components/SelectFilter';
import Input from '../../../../components/Input';
import styles from './styles.module.css';
import { TaskSTATUSES } from '../../../../constants/constants';
import { useEditTaskModal } from './hook';

type Props = {
  open: boolean;
  onClose: () => void;
  taskId: number | null;
};

const PmEditTaskModal: React.FC<Props> = ({ open, onClose, taskId }) => {
  const {
    loading, saving, error,
    title, description,
    status, setStatus,
    note, setNote,
    duration, setDuration,
    isCompleted, canSubmit, isReopened,
    submit,
  } = useEditTaskModal({ open, onClose, taskId });

  return (
    <Modal open={open} onClose={onClose} title={"Edit Task"} size="sm">
      {loading ? (
        <div className={styles.center}>Loading…</div>
      ) : (
        <div className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.readonly}>
            <div>
              <div className={styles.label}>Title</div>
              <div className={styles.text}>{title || '—'}</div>
            </div>
            <div>
              <div className={styles.label}>Description</div>
              <div className={styles.text}>{description || '—'}</div>
            </div>
          </div>

          <div className={styles.row}>
            <SelectFilter
              label="Status"
              options={TaskSTATUSES}
              selected={status}
              onChange={setStatus}
              placeholder="Select status"
            />
          </div>

          {isCompleted && (
            <div className={styles.grid}>
              <Input
                label="Note"
                placeholder="Completion note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <Input
                label="Duration (hours)"
                type="number"
                placeholder="e.g., 2"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          )}

          {isReopened && (
            <div className={styles.row}>
              <Input
                label="Note"
                placeholder="Reson of Reopen"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={submit}
              className={styles.btnPrimary}
              disabled={!canSubmit || saving}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default PmEditTaskModal;
