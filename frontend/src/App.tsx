
import './App.css';
import React from 'react';
import './assets/styles/base.css';
import AppRoutes from './routes/routes';
//import { PrimeReactProvider } from 'primereact/api';
import { colorService } from './services/colorService';

function App() {
   React.useEffect(() => {
    colorService();
  }, []);

  return (
      <AppRoutes />
  );

}

export default App
