import { useMemo } from "react";

export function useSelectOptions(options = []) {
  const normalized = useMemo(() => {
    return (options || []).map((opt) => {
      if (opt && Object.prototype.hasOwnProperty.call(opt, "id")) {
        const value = opt.id;
        const label = opt.name ?? String(opt.id);
        return { value, label };
      }
      return { value: opt, label: opt };
    });
  }, [options]);

  return { normalized };
}