import React from 'react';
import Input from '../../../../../components/Input';
import SelectFilter from '../../../../../components/SelectFilter';
import { useProjectCreate } from './hook';
import Button from '../../../../../components/Button';
import styles from './styles.module.css';

const ProjectCreatePage: React.FC = () => {
  const {
    values,
    setField,
    clientOptions,
    pmOptions,
    handleCreateClick,
    creating,
    formError,
    descTooShort,
    membersTooFew,
  } = useProjectCreate();

  return (
    <div className={styles.form}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Create Project</h2>
      </div>

      {formError && <div className={styles.errorBanner}>{formError}</div>}

      {/* Title — full width */}
      <div className={styles.fieldWrap}>
        <Input
          label="Project Name"
          placeholder="e.g., Smush Burger"
          value={values.name}
          onChange={(e) => setField('name', e.target.value)}
        />
      </div>

      {/* Description — full width + live hint */}
      <div className={styles.fieldWrap}>
        <Input
          label="Description"
          placeholder="Short description"
          value={values.description}
          onChange={(e) => setField('description', e.target.value)}
        />
        {descTooShort && (
          <p className={styles.error}>Too small (min 20 characters)</p>
        )}
      </div>

      {/* Client + PM — two columns */}
      <div className={styles.rowTwo}>
        <div className={styles.fieldWrap}>
          <SelectFilter
            label="Client"
            options={clientOptions}
            selected={values.client_id}
            onChange={(val) => setField('client_id', val as number)}
            placeholder="Select a client"
          />
        </div>

        <div className={styles.fieldWrap}>
          <SelectFilter
            label="Project Manager"
            options={pmOptions}
            selected={values.pm_id}
            onChange={(val) => setField('pm_id', val as number)}
            placeholder="Select a project manager"
          />
        </div>
      </div>

      {/* Members — full width + live hint */}
      <div className={styles.fieldWrap}>

        {membersTooFew && (
          <p className={styles.error}>At least 3 members including the PM</p>
        )}
      </div>

      <div className={styles.actions}>
        <Button
          onClick={handleCreateClick}
          label={creating ? 'Creating…' : 'Create Project'}
        />
      </div>
    </div>
  );
};

export default ProjectCreatePage;