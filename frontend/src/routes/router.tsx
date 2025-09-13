import Login from '../features/Common/Login';
import { PmLayout } from '../layouts/PmLayout';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { skillsLoader } from './loaders/usersLoader';
import { createBrowserRouter } from 'react-router-dom';
import { EmployeeLayout } from '../layouts/EmployeeLayout';
import { dashboardLoader } from './loaders/dashboardLoader';
import ViewProjects from '../features/Common/ViewProjects/pages';
import TasksTablePage from '../features/Employee/pages/tasks/view';
import { projectsCreateLoader } from './loaders/projectsCreateLoader';
import TasksPage from '../features/Admin/ProjetsManagement/pages/create';
import TaskCreatePage from '../features/ProjectManager/pages/tasks/create';
import UsersTablePage from '../features/Admin/UsersManagement/pages/View';
import ProjectCreatePage from '../features/Admin/ProjetsManagement/pages/create';
import AdminDashboard from '../features/Admin/Dashboard/pages';
import UserCreatePage from '../features/Admin/UsersManagement/pages/create';
import { usersCreateLoader } from './loaders/usersCreateLoader';
import ForbiddenPage from '../components/ForbiddenPage';
import { usersEditLoader } from './loaders/usersEditLoader';

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },

  {
    element: <AuthLayout />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <p>dashboard</p> },
          { path: 'test', element: <TasksPage /> },
          { path: 'forbidden', element: <ForbiddenPage /> },
          { path: "/projects", element: <ViewProjects /> },
          {
            element: <AdminLayout />,
            children: [
              { path: 'dashboard', element: <AdminDashboard />, loader: dashboardLoader },
              { path: 'users', element: <UsersTablePage />, loader: skillsLoader },
              { path: 'users/create', element: <UserCreatePage />, loader: usersCreateLoader },
              { path: 'projects/create', element: <ProjectCreatePage />, loader: projectsCreateLoader },
              { path: 'users/edit/{userId}', element: <UserCreatePage />, loader: usersEditLoader },
            ],
          },
          {
            element: <PmLayout />,
            children: [
              { path: 'tasks/create', element: <TaskCreatePage /> },
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
