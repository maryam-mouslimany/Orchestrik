import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import SimpleMuiTable from '../../../../../components/Table';
import { useUsersTable } from './hook';
import Sidebar from '../../../../../components/Sidebar';

export const UsersTablePage: React.FC = () => {
  const { rows, columns, loading, error } = useUsersTable();

  return (
    <Box>
      <Sidebar />
      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <CircularProgress size={18} /> Loading users…
        </Box>
      )}
      {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}

      <SimpleMuiTable
        rows={rows}
        columns={columns}
        getRowId={(r: any) => r.id}
        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, opacity: loading ? 0.7 : 1 }}
      />
    </Box>
  );
};

export default UsersTablePage;
