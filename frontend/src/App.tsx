
import './App.css';
import './assets/styles/base.css';
import React, { useState, useEffect } from 'react';
import Login from './features/Login/pages';
import { PrimeReactProvider } from 'primereact/api';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const [primaryColor, setPrimaryColor] = useState<string | null>(null);
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user); 
        const color = parsedUser?.data?.role?.color; 

        if (color) {
          setPrimaryColor(color); 
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error); 
      }
    } else {
      console.log('No user found in localStorage'); 
    }
  }, []); 

  useEffect(() => {
    if (primaryColor) {
      document.documentElement.style.setProperty('--primary-color', primaryColor);
    }
  }, [primaryColor]); 


  return (
    <PrimeReactProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </BrowserRouter>
    </PrimeReactProvider>
  );

}

export default App
