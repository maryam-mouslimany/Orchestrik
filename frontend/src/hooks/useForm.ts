import { useCallback, useState } from 'react';

export const useForm = <T extends Record<string, any>>(initial: T) => {
  const [values, setValues] = useState<T>(initial);

  const setField = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setValues(v => ({ ...v, [name]: value }));
  }, []);

  const reset = useCallback(() => setValues(initial), [initial]);

  return { values, setField, setValues, reset };
};
