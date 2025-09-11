import React from 'react';
import { useLogin } from './hook';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import logo from '../../../assets/images/logo.png';
import styles from './styles.module.css';

const Login: React.FC = () => {
    const {
        email,
        password,
        setEmail,
        setPassword,
        isValid,
        handleLogin,
        emailError,
        passwordError,
    } = useLogin();

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <img src={logo} alt="Logo" className={styles.logo} />
                <h2 className={styles.title}>Sign In to Your Account</h2>

                <div className={styles.form}>
                    <div className={styles.formGroup}>
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <p className={styles.error}>{emailError}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {passwordError && <p className={styles.error}>{passwordError}</p>}
                    </div>

                    <Button
                        label="Login"
                        onClick={handleLogin}
                        disabled={!isValid}
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
