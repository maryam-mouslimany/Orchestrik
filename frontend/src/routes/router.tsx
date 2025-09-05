import { createBrowserRouter } from 'react-router-dom';
import Login from '../features/Login/pages';
import { UsersTablePage } from '../features/Admin/UsersManagement/pages/View';
import { AppLayout } from '../layouts/AppLayout';
import { rootLoader } from './loaders/rootLoader';


export const router = createBrowserRouter([

  { path: '/login', element: <Login /> },

  // Root route: wraps the whole app section that needs skills
  {
    path: '/',
    element: <AppLayout />,
    loader: rootLoader,            
    children: [
      { index: true, element:<p>dashboard</p> },           
      { path: 'dashboard', element: <p>dashboard</p> },
      { path: 'users', element: <UsersTablePage /> },
      { path: '*', element: <p>Not found</p> },
    ],
  },
]);
