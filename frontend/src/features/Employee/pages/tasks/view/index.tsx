import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import SimpleMuiTable from '../../../../../components/Table';
import SelectFilter from '../../../../../components/SelectFilter';
import { useTasksTable } from './hook';
import Pill from '../../../../../components/Pill';
import { TaskPriorities, TaskSTATUSES } from '../../../../../constants/constants';

export const TasksTablePage: React.FC = () => {
  const {
    rows, columns, loading, error,
    projectId, setProjectId, status, setStatus, priority, setPriority, projectsOptions,

  } = useTasksTable();

  return (
    <Box>

      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <CircularProgress size={18} /> Loading tasks...
        </Box>
      )}
      {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}

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
      <SimpleMuiTable
        rows={rows}
        columns={columns}
        getRowId={(r: any) => r.id}
        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, opacity: loading ? 0.7 : 1 }}
      />
    </Box>
  );
};

export default TasksTablePage;
