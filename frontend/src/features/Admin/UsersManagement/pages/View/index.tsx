import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import SimpleMuiTable from '../../../../../components/Table';
import SelectFilter from '../../../../../components/SelectFilter';
import { ROLES } from '../../../../../constants/constants';
import { useUsersTable } from './hook';
import MultipleSelectChip from '../../../../../components/MultipleSelectFilter';

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
        label="PositiRolesons"
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

      <MultipleSelectChip
        label="Skills"
        options={skillsOptions}
        selected={skills}
        onChange={setSkills}
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
