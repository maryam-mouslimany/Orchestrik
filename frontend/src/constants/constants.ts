export const ROLES = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Project Manager' },
  { id: 3, name: 'Employee' },
];

export const PROJECTSTATUSES = [
  'active', 'on_hold', 'completed'
];

export const TaskSTATUSES = [
  'pending', 'completed', 'in progress', 'reopened'
];

export const TaskPriorities = [
  'low', 'medium', 'high'
]

export const roleHome: Record<string, string> = {
  admin: "/dashboard",
  pm: "/projects",
  employee:"/my-tasks",
};

