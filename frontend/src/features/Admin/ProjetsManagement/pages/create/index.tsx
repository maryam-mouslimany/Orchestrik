import React from 'react';
import Input from '../../../../../components/Input';
import SelectFilter from '../../../../../components/SelectFilter';
import { useProjectCreate } from './hook';
import MultiChipSelect from '../../../../../components/MultipleSelectFilter';
import Button from '../../../../../components/Button';
const ProjectCreatePage: React.FC = () => {
  const { values, setField, clientOptions, statusOptions, pmUsers, employeeUsers, createProject } = useProjectCreate();

  return (
    <form onSubmit={(e) => e.preventDefault()} >
      {/* Name */}
      <Input
        label="Project Name"
        placeholder="e.g., Smush Burger"
        value={values.name}
        onChange={(e) => setField('name', e.target.value)}
      />

      {/* Description */}
      <Input
        label="Description"
        placeholder="Short description"
        value={values.description}
        onChange={(e) => setField('description', e.target.value)}
      />

      {/* Client (from loader) */}
      <SelectFilter
        label="Client"
        options={clientOptions}    
        selected={values.client_id}
        onChange={(val) => setField('client_id', val)}
        placeholder="Select a client"
      />

      {/* Status (from constants PROJECT_STATUSES) */}
      <SelectFilter
        label="Status"
        options={statusOptions}     // supports {value,label} or {name,label} via your normalizer
        selected={values.status}    // string | ''
        onChange={(val) => setField('status', val)}
        placeholder="Select status"
      />

      <SelectFilter
        label="Project Manager"
        options={pmUsers}     // supports {value,label} or {name,label} via your normalizer
        selected={values.pm_id}    // string | ''
        onChange={(val) => setField('pm_id', val)}
        placeholder="Assign a Project Manager"
      />

      <MultiChipSelect
        label="Skills"
        options={employeeUsers}
        selected={values.employees_id}
        onChange={(val) => setField('employees_id', val)}
      />

       <Button
        label="Create Project"
        onClick={createProject}
      />
    </form>
  );
};

export default ProjectCreatePage;