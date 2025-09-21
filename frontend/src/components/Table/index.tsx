import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import TableHead from '@mui/material/TableHead';

import { useRowExpansion, type ExpansionConfig } from './hook';
import styles from './styles.module.css';

export type Column<T> = {
  key: keyof T | string;
  label?: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => React.ReactNode;
};


export type SimpleMuiTableProps<T> = {
  rows: T[];
  columns: Column<T>[];
  getRowId?: (row: T, index: number) => string | number;

  expandable?: ExpansionConfig & {
    renderExpanded: (row: T) => React.ReactNode;
    isRowExpandable?: (row: T) => boolean;
  };

  sx?: any;
  className?: string;
};

export const SimpleMuiTable = <T,>({
  rows,
  columns,
  getRowId = (_r, i) => i,
  expandable,
  sx,
  className,
}: SimpleMuiTableProps<T>) => {
  const expandCfg: ExpansionConfig = {
    enabled: expandable?.enabled ?? false,
    expandOnRowClick: expandable?.expandOnRowClick ?? true,
    showIndicator: expandable?.showIndicator ?? true,
    initiallyExpandedIds: expandable?.initiallyExpandedIds,
  };

  const { isExpanded, toggle } = useRowExpansion(expandCfg);

  return (
    < TableContainer className={[styles.container, className].filter(Boolean).join(' ')} >
      <Table size="small" aria-label="table" className={styles.table}>
        <TableHead>
          <TableRow className={styles.headRow}>
            {columns.map((c, i) => (
              <TableCell key={`${String(c.key)}-${i}`} className={styles.headCell} sx={{ width: c.width }}>
                {c.label ?? String(c.key)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>


        <TableBody>
          {rows.map((row, rowIndex) => {
            const id = getRowId(row, rowIndex);
            const canExpand =
              !!expandCfg.enabled && (expandable?.isRowExpandable?.(row) ?? true);
            const open = canExpand && isExpanded(id);

            const onMainRowClick =
              expandCfg.expandOnRowClick && canExpand ? () => toggle(id) : undefined;

            return (
              <React.Fragment key={id}>
                <TableRow
                  hover
                  onClick={onMainRowClick}
                  className={styles.row}
                  sx={{
                    cursor:
                      canExpand && expandCfg.expandOnRowClick ? 'pointer' : 'default',
                  }}
                >
                  {canExpand && expandCfg.showIndicator && (
                    <TableCell padding="checkbox" sx={{ width: 40 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(id);
                        }}
                        aria-label={open ? 'Collapse row' : 'Expand row'}
                        aria-expanded={open}
                      >
                        {open ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                      </IconButton>
                    </TableCell>
                  )}

                  {columns.map((col, ci) => {
                    const value = (row as any)[col.key as any];
                    const content = col.render ? col.render(value, row, rowIndex) : value;
                    return (
                      <TableCell
                        key={`${String(col.key)}-${ci}`}
                        align={col.align ?? 'left'}
                        sx={{ width: col.width }}
                        title={typeof content === 'string' ? content : undefined}
                        className={styles.cell}
                      >
                        {content}
                      </TableCell>
                    );
                  })}
                </TableRow>

                {canExpand && (
                  <TableRow className={styles.expandedRow}>
                    <TableCell
                      colSpan={(expandCfg.showIndicator ? 1 : 0) + columns.length}
                      sx={{ py: 0, border: 0 }}
                    >
                      <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box className={styles.expandedBox}>{expandable!.renderExpanded(row)}</Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer >
  );
};

export default SimpleMuiTable;
