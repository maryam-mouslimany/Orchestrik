// SelectFilter/index.jsx
import styles from "./styles.module.css";
import { useSelectOptions } from "./hook";

const SelectFilter = ({ label, options, selected, onChange, placeholder = "All" }) => {
  
  const { normalized } = useSelectOptions(options);

  const handleChange = (e) => {
    onChange(e.target.value);          
  };

  return (
    <div className={styles.selectFilter}>
      {label && <label className={styles.label}>{label}</label>}

      <select
        className={styles.select}
        value={selected}     
        onChange={handleChange}
        aria-label={label || "filter select"}
      >
        <option value="">{placeholder}</option>
        {normalized.map((opt, i) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectFilter;
