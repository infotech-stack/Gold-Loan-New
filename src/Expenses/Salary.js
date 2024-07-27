import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Container, TextField, Button, Grid, Typography, Paper } from '@mui/material';

const Salary = () => {
  const [formData, setFormData] = useState({
    employeeName: '',
    designation: '',
    date: '',
    salaryAmount: '',
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!formData.employeeName || !formData.designation || !formData.date || !formData.salaryAmount) {
      setErrors({
        employeeName: !formData.employeeName,
        designation: !formData.designation,
        date: !formData.date,
        salaryAmount: !formData.salaryAmount,
      });
      return;
    }

    try {
      // Send POST request to backend
      const response = await axios.post('http://localhost:5000/api/salary/add', {
        employeeName: formData.employeeName,
        designation: formData.designation,
        date: formData.date,
        salaryAmount: parseFloat(formData.salaryAmount), // Ensure it's parsed as a number
      });

      console.log('Salary added:', response.data);

    
      setFormData({
        employeeName: '',
        designation: '',
        date: '',
        salaryAmount: '',
      });
      setErrors({});

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Salary data stored successfully.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error adding salary:', error);
     
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to store salary data.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }} sx={{ mt: 10 }} className='paperbg'>
        <Typography variant="h4" align="center" sx={{ mb: 2 }}>
          Salary Payment
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Employee Name"
                name="employeeName"
                variant="outlined"
                fullWidth
            
                value={formData.employeeName}
                onChange={handleInputChange}
                error={errors.employeeName}
                helperText={errors.employeeName && 'Employee Name is required'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Designation"
                name="designation"
                variant="outlined"
                fullWidth
             
                value={formData.designation}
                onChange={handleInputChange}
                error={errors.designation}
                helperText={errors.designation && 'Designation is required'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                name="date"
                type="date"
                variant="outlined"
                fullWidth
          
                value={formData.date}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                error={errors.date}
                helperText={errors.date && 'Date is required'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Salary Amount"
                name="salaryAmount"
                variant="outlined"
                fullWidth
              
                value={formData.salaryAmount}
                onChange={handleInputChange}
                error={errors.salaryAmount}
                helperText={errors.salaryAmount && 'Salary Amount is required'}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Salary;
