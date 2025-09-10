import { type FC } from 'react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import { useMultiSelectChip, type MultiOption } from './hook';
import styles from './styles.module.css';

type Props = {
  label: string;
  options: MultiOption[];
  selected: Array<string | number>;
  onChange: (next: Array<string | number>) => void;
  placeholder?: string;
};

export const MultipleSelectChip: FC<Props> = ({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Select...',
}) => {
  const { handleChange, chipLabels } = useMultiSelectChip({
    options,
    selected,
    onChange,
  });

  return (
    <FormControl fullWidth className={styles.formControl}>
      <label className={styles.label}>{label}</label>

      <Select
        multiple
        value={selected}
        onChange={handleChange}
        input={<OutlinedInput />}
        displayEmpty
        renderValue={(selectedVals) => {
          if ((selectedVals as (string | number)[]).length === 0) {
            return <span className={styles.placeholder}>{placeholder}</span>;
          }
          return (
            <>
              {chipLabels.map((text, i) => (
                <Chip key={`${text}-${i}`} label={text} size="small" />
              ))}
            </>
          );
        }}
        className={styles.selectRoot}  
        MenuProps={{ disablePortal: true }} 
      >
        {options.map(opt => (
          <MenuItem key={opt.id} value={opt.id}>
            {opt.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

  );
};

export default MultipleSelectChip;
