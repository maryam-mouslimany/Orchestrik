import { useState } from 'react';

interface UseButton {
  onClick: () => void;   
  disabled?: boolean;    
  loading?: boolean;     
}

export const useButton = ({ onClick, disabled = false, loading = false }: UseButton) => {
  const [isLoading, setIsLoading] = useState(loading);

  const handleClick = () => {
    if (disabled || isLoading) return;
    setIsLoading(true);
    onClick();
    setIsLoading(false);
  };

  return {
    isLoading,
    handleClick,
    disabled,
  };
};
