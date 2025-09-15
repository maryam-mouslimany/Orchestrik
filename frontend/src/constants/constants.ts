import { type MenuItem } from "../components/sidebar/hook";

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
  employee: "/my-tasks",
};

export const MENU_BY_ROLE: Record<'admin' | 'pm' | 'employee', MenuItem[]> = {
  admin: [
    { key: 'dashboard', label: 'Dashboard', to: '/dashboard' },
    { key: 'users', label: 'Users', to: '/users' },
    { key: 'projects', label: 'Projects', to: '/projects' },
  ],
  pm: [
    { key: 'projects', label: 'Projects', to: '/projects' },
    { key: 'reports', label: 'Reports', to: '/reports' },
    { key: 'tasks', label: 'Tasks', to: '/tasks' },
  ],
  employee: [
    { key: 'my-tasks', label: 'My Tasks', to: '/my-tasks' },
    { key: 'projects', label: 'Projects', to: '/projects' },
    { key: 'profile', label: 'Profile', to: '/profile' },
  ],
};
