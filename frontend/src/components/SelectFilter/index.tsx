// components/SelectFilter/index.jsx
import * as React from "react";
import styles from "./styles.module.css";
import { useSelectOptions } from "./hook";

import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";

const SelectFilter = ({ label, options, selected, onChange, placeholder = "All" }) => {
  const { normalized } = useSelectOptions(options);

  const handleChange = (e) => {
    const raw = e.target.value;
    const match = normalized.find(o => o.value === raw || String(o.value) === String(raw));
    onChange(match ? match.value : raw);
  };

  return (
    <div className={styles.selectFilter}>
      {label && <label className={styles.label}>{label}</label>}

      <FormControl fullWidth className={styles.control}>
        <Select
          value={selected ?? ""}
          onChange={handleChange}
          input={<OutlinedInput />}
          displayEmpty
          className={styles.select}            // custom size
          renderValue={(val) =>
            val === "" ? <span className={styles.placeholder}>{placeholder}</span> : undefined
          }
          MenuProps={{ PaperProps: { className: styles.menuPaper } }}
        >
          {/* Keep an empty item so clear is possible */}
          <MenuItem value="">{placeholder}</MenuItem>

          {normalized.map(opt => (
            <MenuItem key={String(opt.value)} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default SelectFilter;