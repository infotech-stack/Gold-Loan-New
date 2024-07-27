import React, { useState } from 'react';
import { Button, TextField, Paper, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [confirmpasswordError, setConfirmpasswordError] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [phonenumberError, setPhonenumberError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      valid = false;
    } else {
      setEmailError('');
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (name.length < 3) {
      setNameError('Name should be greater than three characters');
      valid = false;
    } else {
      setNameError('');
    }

    if (phonenumber.length !== 10) {
      setPhonenumberError('Phone number should be ten characters');
      valid = false;
    } else {
      setPhonenumberError('');
    }

    if (confirmpassword.length < 1) {
      valid = false;
      setConfirmpasswordError('Confirm password is required');
    } else if (confirmpassword !== password) {
      setConfirmpasswordError('Passwords do not match');
      valid = false;
    } else {
      setConfirmpasswordError('');
    }

    if (valid) {
      try {
        const response = await fetch('http://localhost:5000/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
            phoneNumber: phonenumber,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to register user');
        }

        console.log('User registered successfully');
        setIsAuthenticated(true);
        navigate('/'); // Redirect to home page
      } catch (error) {
        console.error('Error signing up:', error.message);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  return (
    <div className="signup-bgg">
      <Container maxWidth="xs">
        <Paper elevation={3} className="login-container">
          <Typography variant="h5" component="h2" className="login-header">
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit} noValidate className="login-form">
            <TextField
              label="Name"
              type="text"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!nameError}
              helperText={nameError}
              required
              className="login-input"
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
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
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              variant="outlined"
              value={confirmpassword}
              onChange={(e) => setConfirmpassword(e.target.value)}
              error={!!confirmpasswordError}
              helperText={confirmpasswordError}
              required
              className="login-input"
            />
            <TextField
              label="Phone Number"
              type="number"
              fullWidth
              variant="outlined"
              value={phonenumber}
              onChange={(e) => setPhonenumber(e.target.value)}
              error={!!phonenumberError}
              helperText={phonenumberError}
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
              Sign Up
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
}

export default Signup;
