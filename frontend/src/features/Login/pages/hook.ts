import { useState } from 'react';
import apiCall from '../../../services/apiCallService';
import { useAuth } from '../../../contexts/AuthContext';

export const useLogin = () => {
    const defaultRouteByRole: Record<string, string> = {
        admin: '/dashboard',
        pm: '/projects',
        member: '/my-tasks',
    };

    // ✅ Use Auth Context to set user globally
    const { setUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Validation
    const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
    const isPasswordValid = password.length >= 6;
    const isValid = isEmailValid && isPasswordValid;

    const emailError = email && !isEmailValid ? 'Please enter a valid email.' : '';
    const passwordError = password && !isPasswordValid ? 'Password must be at least 6 characters.' : '';

    const handleLogin = async () => {
        if (!isValid) { return; }

        try {
            const res = await apiCall('/guest/login', 'POST', { email, password }, null, false);
            const data = res?.data ?? res; // some wrappers already return the body

            const user = {
                ...data,
                defaultRoute: defaultRouteByRole[data.role.name] ?? '/dashboard', // default route based on role
                lastRoute: defaultRouteByRole[data.role.name] ?? '/dashboard',   // last visited route
            };
            setUser(user);

            console.log('Login successful:', user);

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
