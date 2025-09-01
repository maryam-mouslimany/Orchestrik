// src/pages/Login/hook.ts
import { useState } from 'react';
import apiCall from '../../../services/apiCallService';

export const useLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Validation
    const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
    const isPasswordValid = password.length >= 6;
    const isValid = isEmailValid && isPasswordValid;
    console.log(password)

    const handleLogin = async () => {
        if (!isValid) {
            alert('Please fill out the form correctly!');
            return;
        }

        try {
            const response = await apiCall('/guest/login', 'POST', { email, password }, null, false);
            const { token, ...user } = response;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            console.log('Login successful:', response);

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
    };
};
