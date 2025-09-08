import React from 'react';
import styles from './styles.module.css';
import { useModalBehavior } from './hook';
import { MdClose } from 'react-icons/md'; // <— add this at top

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  closeOnBackdrop?: boolean;
};


const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  size = 'md',
  children,
  closeOnBackdrop = true,
}) => {
  const { handleBackdropClick, stopPropagation } = useModalBehavior({ open, onClose, closeOnBackdrop });

  if (!open) return null;

  return (
    
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={title ?? 'Dialog'} onClick={handleBackdropClick}>
      <div className={`${styles.panel} ${styles[size]}`} onClick={stopPropagation}>
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Close"
             onClick={onClose}
          >
            <MdClose size={20} />   {/* uses currentColor from .iconBtn */}
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
