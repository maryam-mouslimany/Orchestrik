import { useEffect, useCallback } from 'react';

type Params = {
  open: boolean;
  onClose: () => void;
  closeOnBackdrop?: boolean;
};

export const useModalBehavior = ({ open, onClose, closeOnBackdrop = true }: Params) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleBackdropClick = useCallback(() => {
    if (closeOnBackdrop) onClose();
  }, [closeOnBackdrop, onClose]);

  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return { handleBackdropClick, stopPropagation };
};
