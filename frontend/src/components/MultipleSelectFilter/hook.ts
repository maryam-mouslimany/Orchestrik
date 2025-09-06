import { useMemo, useCallback } from 'react';
import type { SelectChangeEvent } from '@mui/material/Select';

export type MultiOption = { id: string | number; name: string };

export type UseMultiSelectChipArgs = {
  options: MultiOption[];
  selected: Array<string | number>;
  onChange: (next: Array<string | number>) => void;
};

export const useMultiSelectChip = ({
  options,
  selected,
  onChange,
}: UseMultiSelectChipArgs) => {
  const idToName = useMemo(() => {
    const m = new Map<string, string>();
    for (const o of options) m.set(String(o.id), o.name);
    return m;
  }, [options]);

  const chipLabels = useMemo(
    () => selected.map(v => idToName.get(String(v)) ?? String(v)),
    [selected, idToName]
  );

  const handleChange = useCallback(
    (e: SelectChangeEvent<typeof selected>) => {
      const { value } = e.target;
      const next =
        typeof value === 'string'
          ? (value.split(',') as Array<string | number>)
          : (value as Array<string | number>);
      onChange(next);
    },
    [onChange]
  );

  return { handleChange, chipLabels };
};
