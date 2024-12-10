import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Styles/Login.module.css';
import supabase from '../supabase-client';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const login = async (event) => {
    event.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      console.log('Login successful', data);
      navigate('/dashboard');
    }
  };

  return (
    <div className={styles.LoginPageContainer}>
      <div className={styles.LoginContainer}>
        <div className={styles.LoginContainerForm}>
          <h1 className={styles.LoginContainerTitle}>Log In</h1>
          <p className={styles.LoginContainerText}>Fill in your email and password to continue</p>

          <form onSubmit={login}>
            <label className={styles.formLabelText} htmlFor="email">Email Address</label><br />
            <input
              className={styles.formInput}
              placeholder='abc@gmail.com'
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className={styles.formLabelText} htmlFor="password">Password</label><br />
            <input
              className={styles.formInput}
              placeholder='******'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className={styles.ForgotPasswordText}>Forgot Password?</p>

          </form>
          <button className={styles.ContinueButton} onClick={login}>Log In</button>

          {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};
