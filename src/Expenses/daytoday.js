import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
} from '@mui/material';

const Accounts = () => {
  const [productName, setProductName] = useState('');
  const [date, setDate] = useState('');
  const [totalRupees, setTotalRupees] = useState('');
  const [errors, setErrors] = useState({}); // State to manage errors

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form fields
    if (!productName || !date || !totalRupees) {
      setErrors({
        productName: !productName,
        date: !date,
        totalRupees: !totalRupees,
      });
      return;
    }

    try {
      // Send POST request to backend
      const response = await axios.post('http://localhost:5000/api/expenses/add', {
        productName,
        date,
        totalRupees: parseFloat(totalRupees), // Ensure it's parsed as a number
      });

      console.log('Expense added:', response.data);

      // Reset form fields and errors
      resetForm();
      setErrors({});

      // Show SweetAlert success message
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Day to Day Expenses stored successfully.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      // Handle error as needed
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to store Day to Day Expenses.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
    }
  };

  const resetForm = () => {
    setProductName('');
    setDate('');
    setTotalRupees('');
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }} sx={{ mt: 10 }} className='paperbg'>
      <Typography variant="h4" align="center" sx={{ mb: 2 }}>
        Day to Day Expenses
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              error={errors.productName}
              helperText={errors.productName && 'Product Name is required'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              error={errors.date}
              helperText={errors.date && 'Date is required'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Total Rupees"
              value={totalRupees}
              onChange={(e) => setTotalRupees(e.target.value)}
              error={errors.totalRupees}
              helperText={errors.totalRupees && 'Total Rupees is required'}
            />
          </Grid>
        </Grid>
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Grid item>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default Accounts;
