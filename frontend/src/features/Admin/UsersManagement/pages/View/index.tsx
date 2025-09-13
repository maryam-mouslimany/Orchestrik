import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import SimpleMuiTable from '../../../../../components/Table';
import SelectFilter from '../../../../../components/SelectFilter';
import { ROLES } from '../../../../../constants/constants';
import { useUsersTable } from './hook';
import MultipleSelectChip from '../../../../../components/MultipleSelectFilter';
import SearchBar from '../../../../../components/SearchBar';
import LoadingIndicator from '../../../../../components/Loading';
import styles from './styles.module.css';

export const UsersTablePage: React.FC = () => {
  const {
    rows, columns, loading, error,
    roleId, setRoleId,
    positionId, setPositionId,
    skillId, setSkillId,
    skillsOptions, positionsOptions,
    nameInput, setNameInput, applyNameFilter,
  } = useUsersTable();

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
