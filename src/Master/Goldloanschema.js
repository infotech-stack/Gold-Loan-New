import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { Button, TextField, Paper, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';

const GoldLoanSchema = () => {
  const [schemaData, setSchemaData] = useState([]);
  const [newSchema, setNewSchema] = useState({
    id: null,
    name: '',
    interestPercent: '',
    timePeriod: '',
  });

  const [errors, setErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    fetchSchemas();
  }, []);

  const fetchSchemas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/schemas');
      setSchemaData(response.data);
    } catch (error) {
      console.error('Error fetching schemas:', error);
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Schema Name validation
    if (!newSchema.name || !/^[a-zA-Z\s]*$/.test(newSchema.name)) {
      newErrors.name = 'Schema Name is required and must contain only letters and spaces';
    }
    
    // Interest Percent validation
    if (!newSchema.interestPercent || isNaN(newSchema.interestPercent)) {
      newErrors.interestPercent = 'Interest Percent is required and must be a number';
    }

    // Time Period validation
    if (!newSchema.timePeriod) {
      newErrors.timePeriod = 'Time Period is required';
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required');
    } else if (password !== 'password123') {
      setPasswordError('Incorrect password');
    } else {
      setPasswordError('');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !passwordError;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchema({ ...newSchema, [name]: value });
  };

  const handleAddSchema = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPassword('');
    setPasswordError('');
  };

  const handleConfirmAdd = async () => {
    if (!validate()) return;
    if (password === 'password123') {
      try {
        if (newSchema.id === null) {
          const response = await axios.post('http://localhost:5000/api/schemas', {
            name: newSchema.name,
            interestPercent: newSchema.interestPercent,
            timePeriod: newSchema.timePeriod,
          });
          setSchemaData([...schemaData, response.data]);
        } else {
          const response = await axios.put(`http://localhost:5000/api/schemas/${newSchema.id}`, {
            name: newSchema.name,
            interestPercent: newSchema.interestPercent,
            timePeriod: newSchema.timePeriod,
          });
          setSchemaData(schemaData.map((schema) =>
            schema.id === newSchema.id ? response.data : schema
          ));
        }
        setNewSchema({
          id: null,
          name: '',
          interestRate: '',
          interestPercent: '',
          timePeriod: '',
        });
        setErrors({});
      } catch (error) {
        console.error('Error saving schema:', error);
      }
    } else {
      alert('Incorrect password. Access denied.');
    }
    setOpenDialog(false);
    setPassword('');
    setPasswordError('');
  };

  return (
    <div style={{ padding: '20px', marginTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px' }} sx={{ mt: 6 }} className='paperbg'>
        <Typography variant="h4" align="center" gutterBottom>
          Gold Schema
        </Typography>
        <Table responsive striped bordered hover style={{ marginTop: '13px' }}>
          <thead>
            <tr>
              <th>Schema Name</th>
              <th>Interest Percent</th>
              <th>Time Period</th>
            </tr>
          </thead>
          <tbody>
            {schemaData.length > 0 ? (
              schemaData.map((schema) => (
                <tr key={schema._id}>
                  <td>{schema.name}</td>
                  <td>{schema.interestPercent }%</td>
                  <td>{schema.timePeriod}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>No data available</td>
              </tr>
            )}
          </tbody>
        </Table>
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          <Grid item xs={12}>
            <Typography variant="h5">
              {newSchema.id ? 'Edit Schema' : 'Add New Schema'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Schema Name"
              name="name"
              value={newSchema.name}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
              style={{ marginBottom: '10px' }}
            />
          </Grid>
        
          <Grid item xs={12} sm={4}>
            <TextField
              label="Interest Percent %"
              name="interestPercent"
              type="number"
              value={newSchema.interestPercent}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              error={!!errors.interestPercent}
              helperText={errors.interestPercent}
              style={{ marginBottom: '10px' }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Time Period"
              name="timePeriod"
              value={newSchema.timePeriod}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              error={!!errors.timePeriod}
              helperText={errors.timePeriod}
              style={{ marginBottom: '10px' }}
            />
          </Grid>
          <Grid item xs={12} >
            <Button variant="contained" color="primary" onClick={handleAddSchema}  className='schema-button'>
              {newSchema.id ? 'Update' : 'Add'}
            </Button>
          </Grid>
        </Grid>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Enter Password</DialogTitle>
          <DialogContent>
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              variant="outlined"
              margin="dense"
              error={!!passwordError}
              helperText={passwordError}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmAdd} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </div>
  );
};

export default GoldLoanSchema;
