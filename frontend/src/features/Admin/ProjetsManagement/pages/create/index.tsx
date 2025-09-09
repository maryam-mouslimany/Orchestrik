import React from 'react';
import Input from '../../../../../components/Input';
import SelectFilter from '../../../../../components/SelectFilter';
import { useProjectCreate } from './hook';

const ProjectCreatePage: React.FC = () => {
  const { values, setField, clientOptions, statusOptions } = useProjectCreate();

  return (
    <form>
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
    </form>
  );
};

export default ProjectCreatePage;
