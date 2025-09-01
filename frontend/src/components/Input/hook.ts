import { useState } from 'react';

interface UseInputProps {
  initialValue?: string;
}

export const useInput = ({ initialValue = '' }: UseInputProps) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const reset = () => setValue('');

  return {
    value,
    onChange,
    reset,
  };
};
