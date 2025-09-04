import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import SimpleMuiTable from '../../../../../components/Table';
import { useUsersTable } from './hook';
import Sidebar from '../../../../../components/Sidebar';
import SelectFilter from '../../../../../components/SelectFilter';
import { useState } from "react";

export const UsersTablePage: React.FC = () => {
  const { rows, columns, loading, error } = useUsersTable();
  const [status, setStatus] = useState<string | null>(null);
  const [roleId,setRoleId] = useState<string | null>(null);
  console.log(status, roleId)
  return (
    <Box>
      <Sidebar />
      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <CircularProgress size={18} /> Loading users…
        </Box>
      )}
      {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
      <SelectFilter
        label="Status"
        options={["active", "inactive"]}  
        selected={status}                
        onChange={(val:string) => setStatus(val)}
      />

      <SelectFilter
        label="Role"
        options={[{ id: 1, name: "Admin" }, { id: 2, name: "PM" }]}
        selected={roleId}                 // e.g., 1 or null
        onChange={setRoleId}
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

export default UsersTablePage;
