import Box from '@mui/material/Box';
import { useUsersTable } from './hook';
import Alert from '@mui/material/Alert';
import { ROLES } from '../../../../../constants/constants';
import SimpleMuiTable from '../../../../../components/Table';
import CircularProgress from '@mui/material/CircularProgress';
import SelectFilter from '../../../../../components/SelectFilter';

export const UsersTablePage: React.FC = () => {
  const {
    rows, columns, loading, error,
    roleId, setRoleId,
    positionId, setPositionId,
    skills, setSkills,
    skillsOptions, positionsOptions,
  } = useUsersTable();

  return (
    <Box>
      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <CircularProgress size={18} /> Loading users…
        </Box>
      )}
      {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}

      <SelectFilter
        label="Roles"
        options={ROLES}
        selected={roleId}
        onChange={setRoleId}
      />

      <SelectFilter
        label="Positions"
        options={positionsOptions}
        selected={positionId}
        onChange={setPositionId}
      />

      <SelectFilter
        label="Skills"
        options={skillsOptions}
        selected={skills}
        onChange={setPositionId}
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
