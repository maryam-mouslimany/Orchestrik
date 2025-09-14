import { useRef, useState, useEffect } from 'react';

export const useForm = (initial: Record<string, any>) => {
  const [values, setValues] = useState<Record<string, any>>(initial);

  const initialRef = useRef(initial);
  useEffect(() => {
    initialRef.current = initial;
  }, [initial]);

  function setField(name: string, value: any) {
    setValues(v => ({ ...v, [name]: value }));
  }

  function reset() {
    setValues(initialRef.current);
  }

  return { values, setField, setValues, reset };
};
