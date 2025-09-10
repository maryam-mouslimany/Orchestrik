// components/DateField/index.tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import styles from './styles.module.css';

type Props = {
  label?: string;
  placeholder?: string;
  value: string; // 'YYYY-MM-DD' or ''
  onChange: (e: { target: { value: string } }) => void;
  disabled?: boolean;
};

const DateField: React.FC<Props> = ({
  label,
  placeholder = 'mm/dd/yyyy',
  value,
  onChange,
  disabled,
}) => {
  const parsed: Dayjs | null = value ? dayjs(value) : null;

  const handleChange = (d: Dayjs | null) =>
    onChange({ target: { value: d ? d.format('YYYY-MM-DD') : '' } });

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={parsed}
          onChange={handleChange}
          enableAccessibleFieldDOMStructure={false}
          slots={{ textField: TextField }}
          slotProps={{
            textField: {
              fullWidth: true,
              placeholder,
              disabled,
            },
          }}
          className = {styles.textField}
        />
      </LocalizationProvider>
    </div>
  );
};

export default DateField;
