// Input.tsx
import React from 'react';
import styles from './styles.module.css';

interface CustomInputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  id?: string;
  name?: string;
  autoComplete?: string;     
  autoCapitalize?: string;  
  autoCorrect?: string;      

  onClear?: () => void;
}

const Input: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,

  id,
  name,
  autoComplete,
  autoCapitalize,
  autoCorrect,

  onClear,
}) => {
  const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);

  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <input
          id={inputId}
          name={name}
          type={type}
          className={styles.input}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
        />
        {value && onClear && (
          <button
            type="button"
            className={styles.resetBtn}
            onClick={onClear}
            aria-label="Clear input"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
