import React, { useState } from 'react';
import { Button, TextField, Paper, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Login.css';

function Login() {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [adminIdError, setAdminIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAdminIdError('');
    setPasswordError('');

    if (!adminId || !password) {
      if (!adminId) setAdminIdError('Admin ID is required');
      if (!password) setPasswordError('Password is required');
      return;
    }

    const isRootAdmin = true; // Flag to indicate root admin login
    const success = await login(adminId, password, isRootAdmin);

    if (success) {
      navigate('/dashboard');
    } else {
      setAdminIdError('Invalid credentials');
      setPasswordError('Invalid credentials');
    }
  };

  return (
    <div className="signup-bg">
      <Container maxWidth="xs">
        <Paper elevation={3} className="login-container">
          <Typography variant="h5" component="h2" className="login-header">
            Admin Login
          </Typography>
          <form onSubmit={handleSubmit} noValidate className="login-form">
            <TextField
              label="Admin ID"
              type="text"
              fullWidth
              variant="outlined"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              error={!!adminIdError}
              helperText={adminIdError}
              required
              className="login-input"
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              required
              className="login-input"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="login-button"
            >
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
}

export default Login;
