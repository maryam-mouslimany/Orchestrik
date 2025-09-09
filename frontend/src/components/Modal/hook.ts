import { useEffect, useCallback } from 'react';

type Params = {
  open: boolean;
  onClose: () => void;
  closeOnBackdrop?: boolean;
};

export const useModalBehavior = ({ open, onClose, closeOnBackdrop = true }: Params) => {
  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // backdrop click
  const handleBackdropClick = useCallback(() => {
    if (closeOnBackdrop) onClose();
  }, [closeOnBackdrop, onClose]);

  // stop clicks inside panel from bubbling to backdrop
  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return { handleBackdropClick, stopPropagation };
};
