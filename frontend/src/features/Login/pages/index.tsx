import React from 'react';
import { useLogin } from './hook'; 
import Input from '../../../components/Input';
import Button from '../../../components/Button';

const Login: React.FC = () => {
    const { email, password, setEmail, setPassword, isValid, handleLogin } = useLogin();

    return (
        <div className="login-container">
            <h2>Sign In to Your Account</h2>
            <form onSubmit={(e) => e.preventDefault()}>

                <div className="form-group">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <Button
                    label="Login"
                    onClick={handleLogin}
                    disabled={!isValid} // Disable the button until the form is valid
                />
            </form>
        </div>
    );
};

export default Login;
