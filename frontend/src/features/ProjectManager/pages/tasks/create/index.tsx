import React from 'react';
import Input from '../../../../../components/Input';
import SelectFilter from '../../../../../components/SelectFilter';
import { useTaskCreate } from './hook';
import { TaskPriorities } from '../../../../../constants/constants';
import { TaskSTATUSES } from '../../../../../constants/constants';
import Button from '@mui/material/Button';

const TaskCreatePage: React.FC = () => {
  const { values, setField } = useProjectCreate();

  return (
    <form>
      <Input
        label="Title"
        placeholder="Enter the task title"
        value={values.title}
        onChange={(e) => setField('title', e.target.value)}
      />

      <Input
        label="Description"
        placeholder="Short description"
        value={values.description}
        onChange={(e) => setField('description', e.target.value)}
      />

      <SelectFilter
        label="Priority"
        options={TaskPriorities}    
        selected={values.priority}
        onChange={(val) => setField('priority', val)}
        placeholder="Select a priority"
      />

      <SelectFilter
        label="Status"
        options={TaskSTATUSES}     
        selected={values.status}    
        onChange={(val) => setField('status', val)}
        placeholder="Select status"
      />
    </form>
  );
}

export default TaskCreatePage;
