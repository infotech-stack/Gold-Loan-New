import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Box, Paper, Typography } from '@mui/material';
import Swal from 'sweetalert2';

const AddAdminPage = () => {
  const [newAdminId, setNewAdminId] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [errors, setErrors] = useState({ adminId: '', password: '' });

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:5000/api/rootadmin/registers', {
          rootAdminId: newAdminId,
          password: newAdminPassword
        });

        if (response.data.message === 'Root Admin created successfully') {
          Swal.fire('Success', 'New root admin created successfully!', 'success');
          // Optionally redirect after successful creation
          // history.push('/'); // Import history if using Router
     // Refresh the page
        } else {
          Swal.fire('Error', 'Failed to create new root admin.', 'error');
        }
      } catch (error) {
        console.error('Error creating root admin:', error);
        Swal.fire('Error', 'An error occurred while creating new root admin.', 'error');
      }
    }
  };

  const validateForm = () => {
    let formIsValid = true;
    let errors = { adminId: '', password: '' };

    if (!newAdminId) {
      formIsValid = false;
      errors.adminId = 'Admin ID is required';
    }

    if (!newAdminPassword) {
      formIsValid = false;
      errors.password = 'Password is required';
    } else if (newAdminPassword.length < 6) {
      formIsValid = false;
      errors.password = 'Password must be at least 6 characters long';
    }

    setErrors(errors);
    return formIsValid;
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper sx={{ padding: 4, maxWidth: 400, width: '100%', boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom>
          Create New Root Admin
        </Typography>
        <form onSubmit={handleCreateAdmin}>
          <TextField
            margin="dense"
            id="newAdminId"
            label="Admin ID"
            type="text"
            fullWidth
            variant="outlined"
            value={newAdminId}
            onChange={(e) => setNewAdminId(e.target.value)}
            error={Boolean(errors.adminId)}
            helperText={errors.adminId}
            sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'black',
                  },
                },
              }}
          />
          <TextField
            margin="dense"
            id="newAdminPassword"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newAdminPassword}
            onChange={(e) => setNewAdminPassword(e.target.value)}
            error={Boolean(errors.password)}
            helperText={errors.password}
            sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'black',
                  },
                },
              }}
          />
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Create Admin
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddAdminPage;
