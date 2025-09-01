import React from 'react';
import styles from './styles.module.css';

// Props interface for the Input component
interface CustomInputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
}

export const Input: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  type = 'text',
  value,      
  onChange,   
}) => {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrapper}>
        <input
          type={type}
          className={styles.input}
          placeholder={placeholder}
          value={value} 
          onChange={onChange}  
        />
        {value && (
          <button type="button" className={styles.resetBtn} onClick={() => onChange({ target: { value: '' } })}>
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
