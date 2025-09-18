import { useTasksTable } from './hook';
import Box from '@mui/material/Box';
import React, { useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import styles from './styles.module.css';
import { FiEdit2 } from 'react-icons/fi';
import SimpleMuiTable from '../../../../../components/Table';
import SelectFilter from '../../../../../components/SelectFilter';
import EditTaskModal from '../../../components/EditTaskModal';
import LoadingIndicator from '../../../../../components/Loading';
import { TaskPriorities, TaskSTATUSES } from '../../../../../constants/constants';
import Pagination from '../../../../../components/Pgination';

export const TasksTablePage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const {
    rows, columns: baseColumns, loading, error,
    projectId, setProjectId, status, setStatus, priority, setPriority, projectsOptions, isPaginated,
    page, setPage,perPage,total,
  } = useTasksTable();

  const columnsWithActions = useMemo(() => {
    const base = baseColumns.filter(c => String(c.key).toLowerCase() !== 'actions');
    return [
      ...base,
      {
        key: 'actions',
        label: 'Actions',
        width: 50,
        render: (_v: any, row: any) => (
          <button
            type="button"
            className={styles.actionIconBtn}
            aria-label="Edit task"
            onClick={(e) => { e.stopPropagation(); setSelectedTaskId(row.id); setOpen(true); }}
          >
            <FiEdit2 size={18} />
          </button>
        ),
      },
    ];
  }, [baseColumns]);

  return loading ? (
    <LoadingIndicator fullscreen />
  ) : (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}

      <div className={styles.filterRow}>
        <SelectFilter
          sm
          label="Priority"
          options={TaskPriorities}
          selected={priority}
          onChange={setPriority}
        />
        <SelectFilter
          sm
          label="Status"
          options={TaskSTATUSES}
          selected={status}
          onChange={setStatus}
        />
        <SelectFilter
          sm
          label="Project"
          options={projectsOptions}
          selected={projectId}
          onChange={setProjectId}
        />
      </div>

      <SimpleMuiTable
        rows={rows}
        columns={columnsWithActions}
        getRowId={(r: any) => r.id}
        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
      />

      <EditTaskModal
        open={open}
        onClose={() => setOpen(false)}
        taskId={selectedTaskId}
      />
      {isPaginated && (
        <Pagination
          page={page}
          perPage={perPage}
          total={total}
          onPageChange={(p) => setPage(p)}
          disabled={loading}
        />
      )}

    </Box>
  );
};

export default TasksTablePage;

