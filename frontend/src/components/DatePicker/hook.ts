import { useState } from 'react';

type Props = { initialValue?: string };
export const useDateField = ({ initialValue = '' }: Props) => {
  const [value, setValue] = useState<string>(initialValue);

  const onChange = (e: { target: { value: string } }) => {
    setValue(e.target.value);
  };

  return { value, onChange };
};
