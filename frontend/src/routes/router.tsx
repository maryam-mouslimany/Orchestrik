import Login from '../features/Login/pages';
import { AppLayout } from '../layouts/AppLayout';
import { rootLoader } from './loaders/rootLoader';
import { createBrowserRouter } from 'react-router-dom';
import { projectsCreateLoader } from './loaders/projectsCreateLoader';
import { UsersTablePage } from '../features/Admin/UsersManagement/pages/View';
import ProjectCreatePage from '../features/Admin/ProjetsManagement/pages/create';

export const router = createBrowserRouter([

  { path: '/login', element: <Login /> },

  {
    path: '/',
    element: <AppLayout />,
    loader: rootLoader,
    children: [
      { index: true, element: <p>dashboard</p> },
      { path: 'dashboard', element: <p>dashboard</p> },
      { path: 'users', element: <UsersTablePage /> },
      { path: 'projects/create', element: <ProjectCreatePage />, loader: projectsCreateLoader },
      { path: '*', element: <p>Not found</p> },
    ],
  },
]);
