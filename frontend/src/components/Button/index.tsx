import React from 'react';
import styles from './styles.module.css';
import { useButton } from './hook.ts';

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false, loading = false }) => {
  const { isLoading, handleClick } = useButton({ onClick, disabled, loading });

  return (
    <button 
      className={styles.button} 
      onClick={handleClick} 
      disabled={disabled || isLoading}
    >
      {isLoading ? <div className={styles.loading}></div> : label}
    </button>
  );
};

export default Button;
