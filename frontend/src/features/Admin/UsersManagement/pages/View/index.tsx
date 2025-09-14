import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import SimpleMuiTable from '../../../../../components/Table';
import SelectFilter from '../../../../../components/SelectFilter';
import { ROLES } from '../../../../../constants/constants';
import { useUsersTable, type UserRow } from './hook';
import SearchBar from '../../../../../components/SearchBar';
import LoadingIndicator from '../../../../../components/Loading';
import styles from './styles.module.css';
import CreateButton from '../../../../../components/CreateButton/Button';
import { FiEdit3, FiTrash2, FiRotateCcw } from 'react-icons/fi';

export const UsersTablePage: React.FC = () => {
  const {
    rows, loading, error,
    roleId, setRoleId,
    positionId, setPositionId,
    skillId, setSkillId,
    skillsOptions, positionsOptions,  onEdit, onDelete, onRestore,
    nameInput, setNameInput, applyNameFilter,
  } = useUsersTable();

  const columns: Column<UserRow>[] = [
    { key: 'id', label: 'ID', width: 20 },
    { key: 'name', label: 'Name', width: 90 },
    { key: 'email', label: 'Email', width: 100 },
    { key: 'role', label: 'Role', width: 30 },
    { key: 'position', label: 'Position', width: 100 },
    { key: 'skills', label: 'Skills', width: 300 },
    {
      key: 'actions',
      label: 'Actions',
      width: 50,
      render: (_value, row) => (
        <div className={styles.actions}>
          <FiEdit3
            className={styles.icon}
            title="Edit"
            onClick={() => onEdit(row.id)}
          />
          {row.deleted ? (
            <FiRotateCcw
              className={styles.icon}
              title="Restore"
              onClick={() => onRestore(row.id)}
            />
          ) : (
            <FiTrash2
              className={styles.red}
              title="Delete"
              onClick={() => onDelete(row.id)}
            />
          )}
        </div>
      ),
    },
  ];
  return loading ? (
    <LoadingIndicator />
  ) : (
    <Box>
      {error && <Alert severity="error" className={styles.errorAlert}>{error}</Alert>}

      {/* Filters row */}
      <div className={styles.filterRow}>
        <div className={styles.filterSearch}>
          <SearchBar
            placeholder="Search by name…"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            applyOnEnter
            onApply={applyNameFilter}
          />
        </div>

        <div className={styles.filterItem}>
          <SelectFilter
            sm
            label="Roles"
            options={ROLES}
            selected={roleId}
            onChange={setRoleId}
          />
        </div>

        <div className={styles.filterItemWide}>
          <SelectFilter
            sm
            label="Positions"
            options={positionsOptions}
            selected={positionId}
            onChange={setPositionId}
          />
        </div>
        <div className={styles.filterItemWide}>
          <SelectFilter
            sm
            label="Skills"
            options={skillsOptions}
            selected={skillId}
            onChange={setSkillId}
          />
        </div>
        <CreateButton to="/users/create" />
      </div>

      <SimpleMuiTable
        rows={rows}
        columns={columns}
        getRowId={(r: any) => r.id}
        className={styles.table}
      />
    </Box>
  );
};

export default UsersTablePage;
