import { useTasksTable } from './hook';
import Box from '@mui/material/Box';
import React, { useMemo, useState } from 'react'; 
import Alert from '@mui/material/Alert';
import SimpleMuiTable from '../../../../../components/Table';
import SelectFilter from '../../../../../components/SelectFilter';
import EditTaskModal from '../../../components/EditTaskModal';
import CircularProgress from '@mui/material/CircularProgress';
import { TaskPriorities, TaskSTATUSES } from '../../../../../constants/constants';
import styles from './styles.module.css';
import { FiEdit2 } from 'react-icons/fi';                 // ← CHANGED: react-icons

export const TasksTablePage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null); // NEW

  const {
    rows, columns: baseColumns, loading, error,
    projectId, setProjectId, status, setStatus, priority, setPriority, projectsOptions,
  } = useTasksTable();

  // NEW: build columns with Actions here (so we can access setSelectedTaskId/setOpen)
  const columnsWithActions = useMemo(() => {
    const base = baseColumns.filter(c => String(c.key).toLowerCase() !== 'actions'); // safe if hook still has it
    return [
      ...base,
      {
        key: 'actions',
        label: 'Actions',
        width: 80,
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

return (
  <Box>

    {loading && (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <CircularProgress size={18} /> Loading tasks...
      </Box>
    )}
    {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}

    <div className={styles.filterRow}>
      <SelectFilter
        label="Priority"
        options={TaskPriorities}
        selected={priority}
        onChange={setPriority}
      />
      <SelectFilter
        label="Status"
        options={TaskSTATUSES}
        selected={status}
        onChange={setStatus}
      />
      <SelectFilter
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
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, opacity: loading ? 0.7 : 1 }}
    />

    {/* NEW: wire the modal with the chosen id */}
    <EditTaskModal
      open={open}
      onClose={() => setOpen(false)}
      taskId={selectedTaskId}
    />
  </Box>
);
};

export default TasksTablePage;
