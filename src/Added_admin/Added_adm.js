import React, { useState } from 'react';
import { TextField, Grid, Typography, Button, Checkbox, FormControl, FormHelperText, Select, MenuItem, InputLabel, Paper } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddedAdm = () => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    branch: '',
    phoneNumber: '',
    adminId: '',
    password: '',
    permissions: [],
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    designation: '',
    branch: '',
    phoneNumber: '',
    adminId: '',
    password: '',
    permissions: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePermissionChange = (option) => (e) => {
    const { permissions } = formData;
    const currentIndex = permissions.indexOf(option);
    const newPermissions = [...permissions];

    if (currentIndex === -1) {
      newPermissions.push(option);
    } else {
      newPermissions.splice(currentIndex, 1);
    }

    setFormData({
      ...formData,
      permissions: newPermissions,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    let errors = {};
    let hasErrors = false;

    if (!formData.name) {
      errors.name = 'Name is required';
      hasErrors = true;
    }

    if (!formData.designation) {
      errors.designation = 'Designation is required';
      hasErrors = true;
    }

    if (!formData.branch) {
      errors.branch = 'Branch is required';
      hasErrors = true;
    }

    if (!formData.phoneNumber) {
      errors.phoneNumber = 'Phone Number is required';
      hasErrors = true;
    }

    if (!formData.adminId) {
      errors.adminId = 'Admin ID is required';
      hasErrors = true;
    }

    if (!formData.password) {
      errors.password = 'Password is required';
      hasErrors = true;
    }

    if (formData.permissions.length === 0) {
      errors.permissions = 'Select at least one permission';
      hasErrors = true;
    }

    setFormErrors(errors);

    if (!hasErrors) {
      // Form data is valid, can submit to backend or perform further actions
      try {
        const response = await axios.post('http://localhost:5000/api/admins/register', formData);
        console.log('Admin data saved:', response.data);
      
        // Show success message and refresh the page
        Swal.fire({
          title: 'Success!',
          text: 'Sub admin stored successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          window.location.reload(); // Refresh the page
        });
      } catch (error) {
        console.error('Error saving admin data:', error.message);
        // Handle error state or display error message to user
      }
      
    }
  };

  const permissionOptions =  ['Dashboard', 'Master', 'Customer', 'Adagu', 'Repledge', 'Accounts', 'Reminders', 'Books', 'Tools', 'Added Admin','Branch Management','Root Management','Report','Voucher','Admin Management','Loan Retrieved']

  return (
    <div style={{ padding: '20px', marginTop: '70px' }}>
      <Paper style={{padding:'20px'}} className='paperbg'>
      <Typography variant="h5" gutterBottom>
        Add Administrator
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'black',
                  },
                },
              }}
            />
          </Grid>

          {/* Designation */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              error={!!formErrors.designation}
              helperText={formErrors.designation}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'black',
                  },
                },
              }}
            />
          </Grid>

          {/* Branch */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              error={!!formErrors.branch}
              helperText={formErrors.branch}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'black',
                  },
                },
              }}
            />
          </Grid>

          {/* Phone Number */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={!!formErrors.phoneNumber}
              helperText={formErrors.phoneNumber}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'black',
                  },
                },
              }}
            />
          </Grid>

          {/* User ID */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Admin ID"
              name="adminId"
              value={formData.adminId}
              onChange={handleChange}
              error={!!formErrors.adminId}
              helperText={formErrors.adminId}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'black',
                  },
                },
              }}
            />
          </Grid>

          {/* Password */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'black',
                  },
                },
              }}
            />
          </Grid>

          {/* Permissions Dropdown */}
          <Grid item xs={12}>
            <FormControl fullWidth error={!!formErrors.permissions}>
              <InputLabel id="permissions-label">Permissions</InputLabel>
              <Select
                labelId="permissions-label"
                id="permissions"
                multiple
                value={formData.permissions}
                onChange={handleChange}
                name="permissions"
                renderValue={(selected) => selected.join(', ')}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'black',
                  },
                }}
              >
                {permissionOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    <Checkbox checked={formData.permissions.indexOf(option) > -1} />
                    {option}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{formErrors.permissions}</FormHelperText>
            </FormControl>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      </Paper>
    </div>
  );
};

export default AddedAdm;
