import * as React from 'react';

export type ExpansionConfig = {
  enabled?: boolean;
  expandOnRowClick?: boolean;
  showIndicator?: boolean;
  initiallyExpandedIds?: Array<string | number>;
};

export const useRowExpansion = (cfg: ExpansionConfig) => {
  const { initiallyExpandedIds } = cfg;

  const [openIds, setOpenIds] = React.useState<Set<string | number>>(
    () => new Set(initiallyExpandedIds ?? [])
  );

  const isExpanded = React.useCallback(
    (id: string | number) => openIds.has(id),
    [openIds]
  );

  const toggle = React.useCallback((id: string | number) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  return { isExpanded, toggle, openIds };
};
