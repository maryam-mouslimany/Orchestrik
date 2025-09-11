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
    const raw = e.target.value; // this will be a string because we stringify below
    const match = normalized.find(o => String(o.value) === String(raw));
    // Return the ORIGINAL option type back to parent (number or string), no parsing here
    onChange(match ? match.value : raw);
  };

  // Value we pass to MUI must match MenuItem.value type -> use string consistently
  const selectValue = selected === "" ? "" : String(selected);

  // Explicit label rendering so CSS won't hide it
  const renderSelected = (val) => {
    if (val === "") return <span className={styles.placeholder}>{placeholder}</span>;
    const item = normalized.find(o => String(o.value) === String(val));
    return item ? <span className={styles.valueLabel}>{item.label}</span> : "";
  };

  return (
    <div className={styles.selectFilter}>
      {label && <label className={styles.label}>{label}</label>}

      <FormControl fullWidth className={styles.control}>
        <Select
          value={selectValue}
          onChange={handleChange}
          input={<OutlinedInput />}
          displayEmpty
          className={styles.select}
          renderValue={renderSelected}
          MenuProps={{ PaperProps: { className: styles.menuPaper } }}
        >
          <MenuItem value="">{placeholder}</MenuItem>

          {normalized.map(opt => (
            <MenuItem key={String(opt.value)} value={String(opt.value)}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default SelectFilter;