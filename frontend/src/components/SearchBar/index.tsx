import React from "react";
import { FiSearch } from "react-icons/fi";
import styles from "./styles.module.css";

type SearchBarProps = {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  onApply?: (value: string) => void;
  applyOnEnter?: boolean;
};

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search…",
  value,
  onChange,
  className = "",
  onApply,
  applyOnEnter = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!applyOnEnter || !onApply) return;
    if (e.key === "Enter") {
      e.preventDefault();
      onApply(value);
    }
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <span className={styles.icon} aria-hidden="true">
        <FiSearch size={18} />
      </span>
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown} 
        aria-label={placeholder}
      />
    </div>
  );
};

export default SearchBar;
