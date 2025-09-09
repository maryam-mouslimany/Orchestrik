import { type FC } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import { useMultiSelectChip, type MultiOption } from './hook';

type Props = {
  label: string;
  options: MultiOption[];
  selected: Array<string | number>;
  onChange: (next: Array<string | number>) => void;
};

export const MultipleSelectChip: FC<Props> = ({
  label,
  options,
  selected,
  onChange,
}) => {
  const { handleChange, chipLabels } = useMultiSelectChip({
    options,
    selected,
    onChange,
  });

  return (
    <FormControl>
      <InputLabel id="multi-chip-label">{label}</InputLabel>
      <Select
        labelId="multi-chip-label"
        multiple
        value={selected}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={() => (
          <>
            {chipLabels.map((text, i) => (
              <Chip key={`${text}-${i}`} label={text} />
            ))}
          </>
        )}
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
