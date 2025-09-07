import { FormControl, InputLabel, Select, MenuItem, Chip, OutlinedInput } from '@mui/material';
import React from 'react';
import styles from './styles.module.css';

type Opt = { id: number | string; name: string };

type Props = {
  label: string;
  options: Opt[];
  selected: Array<number | string>;
  onChange: (v: Array<number | string>) => void;
  placeholder?: string;
};

export default function MultiChipSelect({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Select…',
}: Props) {
  const handleChange = (e: any) => {
    const v = e.target.value;
    onChange(Array.isArray(v) ? v : String(v).split(',').filter(Boolean));
  };

  const renderValue = (selectedIds: unknown) => {
    const ids = Array.isArray(selectedIds) ? (selectedIds as Array<number | string>) : [];
    if (ids.length === 0) {
      return <span className={styles.placeholder}>{placeholder}</span>;
    }
    return (
      <div className={styles.chips}>
        {ids.map((id) => {
          const opt = options.find(o => String(o.id) === String(id));
          return (
            <Chip
              key={String(id)}
              label={opt?.name ?? id}
              size="small"
              className={styles.chip}
            />
          );
        })}
      </div>
    );
  };

  return (
    <FormControl size="small" className={styles.formControl}>
      <InputLabel id="multi-chip-label">{label}</InputLabel>

      <Select
        labelId="multi-chip-label"
        multiple
        displayEmpty
        value={selected}
        onChange={handleChange}
        input={<OutlinedInput label={label} className={styles.inputRoot} />}
        className={styles.selectRoot}
        renderValue={renderValue}
        MenuProps={{}}
      >
        {options.map((opt) => (
          <MenuItem key={opt.id} value={opt.id}>
            {opt.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
