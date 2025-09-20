import React from 'react';
import Input from '../../../../../components/Input';
import SelectFilter from '../../../../../components/SelectFilter';
import { useTaskCreate } from './hook';
import Button from '../../../../../components/Button';
import styles from './styles.module.css';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DateField from '../../../../../components/DatePicker';
import { TaskPriorities } from '../../../../../constants/constants';

const TaskCreatePage: React.FC = () => {
  const {
    values, setField, projectsOptions, members,
    recommendAssignee, recLoading, recReason, createTask, createLoading, formError } = useTaskCreate();

  return (
    <>
      <div className={styles.pageWrap}>
        {(recReason || recLoading) && (
          <div className={styles.reasonCloud} aria-live="polite">
            {recLoading ? (
              <>
                <span className={styles.aiSpinner} aria-hidden />
                <span>Finding best assignee…</span>
              </>
            ) : (
              <>
                <AutoFixHighIcon className={styles.autoAssignIcon} />
                <span>{recReason}</span>
              </>
            )}
          </div>
        )}

        <div className={styles.form} >
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Create Task</h2>
          </div>

          {formError && <div className={styles.errorBanner}>{formError}</div>}

          <div className={styles.fieldWrap}>
            <Input
              label="Title"
              placeholder="Enter the task title"
              value={values.title}
              onChange={(e) => setField('title', e.target.value)}
            />
          </div>

          <div className={styles.fieldWrap}>
            <Input
              label="Description"
              placeholder="Short description"
              value={values.description}
              onChange={(e) => setField('description', e.target.value)}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.fieldWrap}>
              <SelectFilter
                label="Priority"
                options={TaskPriorities}
                selected={values.priority}
                onChange={(val) => setField('priority', String(val))}
                placeholder="Select a priority"
              />
            </div>

            <div className={styles.fieldWrap}>

              <DateField
                label="Deadline"
                value={values.deadline}
                onChange={(e) => setField('deadline', e.target.value)}
              />

            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldWrap}>
              <SelectFilter
                label="Project"
                options={projectsOptions}
                selected={values.project_id}
                onChange={(val) => setField('project_id', val)}
                placeholder="Select a project"
              />
            </div>

            <div className={styles.inlineGroup}>
              <div className={styles.fieldWrap}>
                <SelectFilter
                  label="Assignee"
                  options={members}
                  selected={values.assigned_to}
                  onChange={(val) => setField('assigned_to', val)}
                  placeholder="Assign this task to"
                />
              </div>

              <button
                type="button"
                className={styles.autoAssign}
                onClick={recommendAssignee}
                disabled={recLoading || !values.project_id}
                aria-label="Auto assign"
                title="Auto assign"
              >
                <AutoFixHighIcon className={styles.autoAssignIcon} />
                <span className={styles.autoAssignText}>Auto</span>
              </button>
            </div>
          </div>

          <div className={styles.actions}>
            <Button onClick={createTask} label={createLoading ? 'Creating…' : 'Create task'} />
          </div>

        </div>
      </div>
    </>
  );
}

export default TaskCreatePage;
