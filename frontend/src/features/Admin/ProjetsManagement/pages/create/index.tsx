// index.tsx
import React from 'react';
import Input from '../../../../../components/Input';
import SelectFilter from '../../../../../components/SelectFilter';
import { useProjectCreate } from './hook';
import Button from '../../../../../components/Button';
import MultipleSelectChip from '../../../../../components/MultipleSelectFilter';

const ProjectCreatePage: React.FC = () => {
  const {
    values,
    setField,
    clientOptions,
    pmOptions,
    employeeOptions,
    handleCreateClick,
    creating,

  } = useProjectCreate();


  return (
    <form onSubmit={(e) => e.preventDefault()}>
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
        onChange={(val) => setField('client_id', val as number)}
        placeholder="Select a client"
      />

      <SelectFilter
        label="Project Manager"
        options={pmOptions}
        selected={values.pm_id}
        onChange={(val) => setField('pm_id', val as number)}
        placeholder="Select a project manager"
      />

      <MultipleSelectChip
        label="Members"
        options={employeeOptions}
        selected={values.members}
        onChange={(next) => setField('members', next as number[])}
      />

      <Button
        onClick={handleCreateClick}
        label={creating ? 'Creating…' : 'Create Project'}
      />
    </form>
  );
};

export default ProjectCreatePage;
