// src/features/auth/useLogin.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiCall from '../../../services/apiCallService';
import { useAuth } from '../../../contexts/AuthContext';
import { roleHome } from '../../../constants/constants';
import { authService } from '../../../services/authService';

export const useLogin = () => {
  const DEFAULT_HOME = '/dashboard';

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // basic validation
  const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
  const isPasswordValid = password.length >= 6;
  const isValid = isEmailValid && isPasswordValid;

  const emailError = email && !isEmailValid ? 'Please enter a valid email.' : '';
  const passwordError = password && !isPasswordValid ? 'Password must be at least 6 characters.' : '';

  const handleLogin = async () => {
    if (!isValid) return;

    try {
      const res = await apiCall('/guest/login', { method: 'POST', data: { email, password } });
      const data = res?.data ?? res;

      const role = String(data?.role?.name || '').toLowerCase();
      const dest = roleHome[role] || DEFAULT_HOME;

      const user = {
        ...data,
        token: data?.token,
        defaultRoute: dest,
        lastRoute: dest,
      };
      authService.setUser(user);
      setUser(user);
      navigate(dest, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed, please try again.');
    }
  };

  return {
    email,
    password,
    setEmail,
    setPassword,
    isValid,
    handleLogin,
    emailError,
    passwordError,
  };
};
