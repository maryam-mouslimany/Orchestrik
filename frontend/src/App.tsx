
import React from 'react';
import './App.css';
import './assets/styles/base.css';
import AppRoutes from './routes/routes';
//import { PrimeReactProvider } from 'primereact/api';
import { AuthProvider } from './contexts/AuthContext';

function App() {

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );

}

export default App
