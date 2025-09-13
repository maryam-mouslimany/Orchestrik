import './App.css';
import './assets/styles/base.css';
import { router } from './routes/router';
import { RouterProvider } from 'react-router-dom';
//import { PrimeReactProvider } from 'primereact/api';
import { AuthProvider } from './contexts/AuthContext';
import { Provider } from 'react-redux';
import { store } from './redux/store';

function App() {

  return (
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  );

}

export default App
