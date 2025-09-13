import * as React from "react";
import styles from "./styles.module.css";
import { useSelectOptions } from "./hook";

import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";

// Add `sm?: boolean`
type Props = {
  label?: string;
  options: any[];
  selected: string | number | "";
  onChange: (v: any) => void;
  placeholder?: string;
  sm?: boolean;
};

const SelectFilter: React.FC<Props> = ({
  label,
  options,
  selected,
  onChange,
  placeholder = "All",
  sm = false,
}) => {
  const { normalized } = useSelectOptions(options);

  const handleChange = (e: any) => {
    const raw = e.target.value; // string
    const match = normalized.find((o: any) => String(o.value) === String(raw));
    onChange(match ? match.value : raw);
  };

  // value passed to MUI is string
  const selectValue = selected === "" ? "" : String(selected);

  const renderSelected = (val: string) => {
    if (val === "") return <span className={styles.placeholder}>{placeholder}</span>;
    const item = normalized.find((o: any) => String(o.value) === String(val));
    return item ? <span className={styles.valueLabel}>{item.label}</span> : "";
  };

  const size = sm ? "small" : "medium"; // drives MUI density

  return (
    <div className={`${styles.selectFilter} ${sm ? styles.sm : ""}`}>
      {label && <label className={styles.label}>{label}</label>}

      <FormControl
        fullWidth
        size={size}
        className={`${styles.control} ${sm ? styles.controlSm : ""}`}
      >
        <Select
          value={selectValue}
          onChange={handleChange}
          input={<OutlinedInput size={size} />}
          displayEmpty
          className={`${styles.select} ${sm ? styles.selectSm : ""}`}
          renderValue={renderSelected}
          MenuProps={{
            PaperProps: {
              className: `${styles.menuPaper} ${sm ? styles.menuPaperSm : ""}`,
            },
          }}
        >
          <MenuItem value="">{placeholder}</MenuItem>

          {normalized.map((opt: any) => (
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
