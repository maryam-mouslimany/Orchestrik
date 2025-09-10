import React from 'react';
import Input from '../../../../../components/Input';
import SelectFilter from '../../../../../components/SelectFilter';
import { useProjectCreate } from './hook';
import Button from '../../../../../components/Button';
import { PROJECTSTATUSES } from '../../../../../constants/constants';
import MultipleSelectChip from '../../../../../components/MultipleSelectFilter';

const ProjectCreatePage: React.FC = () => {
  const {
    values,
    setField,
    clientOptions,
    pmOptions,
    employeeOptions,
    createProject,
  } = useProjectCreate();

  return (
    <form>
      <Input
        label="Project Name"
        placeholder="e.g., Smush Burger"
        value={values.name}
        onChange={(e) => setField('name', e.target.value)}
      />

      <Input
        label="Description"
        placeholder="Short description"
        value={values.description}
        onChange={(e) => setField('description', e.target.value)}
      />

      <SelectFilter
        label="Client"
        options={clientOptions}
        selected={values.client_id}
        onChange={(val) => setField('client_id', val)}
        placeholder="Select a client"
      />

      {/* PM (single select) */}
      <SelectFilter
        label="Project Manager"
        options={pmOptions}
        selected={values.pm_id}
        onChange={(val) => setField('pm_id', val as number)}
        placeholder="Select a project manager"
      />

      <SelectFilter
        label="Status"
        options={PROJECTSTATUSES}
        selected={values.status}
        onChange={(val) => setField('status', val)}
        placeholder="Select status"
      />

      {/* Members (multi-select) */}
      <MultipleSelectChip
        label="Members"
        options={employeeOptions}
        selected={values.members}
        onChange={(next) => setField('members', next as number[])}
      />

      <Button onClick={createProject} label="Create Project" />
    </form>
  );
};

export default ProjectCreatePage;
