import Login from '../features/Common/Login';
import { AppLayout } from '../layouts/AppLayout';
import { rootLoader } from './loaders/rootLoader';
import { createBrowserRouter } from 'react-router-dom';
import { projectsCreateLoader } from './loaders/projectsCreateLoader';
import { UsersTablePage } from '../features/Admin/UsersManagement/pages/View';
import ProjectCreatePage from '../features/Admin/ProjetsManagement/pages/create';
import TasksTablePage from '../features/Employee/pages/tasks/view';
import TasksPage from '../features/Admin/ProjetsManagement/pages/create';
import { AuthLayout } from '../layouts/AuthLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { PmLayout } from '../layouts/PmLayout';
import { EmployeeLayout } from '../layouts/EmployeeLayout';
import TaskCreatePage from '../features/ProjectManager/pages/tasks/create';

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },

  {
    element: <AuthLayout />,
    children: [
      {
        element: <AppLayout />,
        loader: rootLoader,
        children: [
          { index: true, element: <p>dashboard</p> },
          { path: 'dashboard', element: <p>dashboard</p> },
          { path: 'test', element: <TasksPage /> },
          { path: 'forbbiden', element: <p>Unauthorized</p> },
          { path: 'tasks/create', element: <TaskCreatePage /> },

          {
            element: <AdminLayout />,
            children: [
              { path: 'users', element: <UsersTablePage /> },
              { path: 'projects/create', element: <ProjectCreatePage />, loader: projectsCreateLoader },
            ],
          }, 
          {
            element: <PmLayout />,
            children: [
              // { path: 'pm/reports', element: <PmReportsPage /> },
            ],
          },

          {
            element: <EmployeeLayout />,
            children: [
              { path: 'my-tasks', element: <TasksTablePage /> },
            ],
          },

          { path: '*', element: <p>Not found</p> },
        ],
      },
    ],
  },
]);
