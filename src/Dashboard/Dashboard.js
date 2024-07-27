import React, { useState } from 'react';
import { Container, Row, Col, Offcanvas } from 'react-bootstrap';
import Sidebar from '../Sidebar/Sidebar';
import AppNavbar from '../Navbar/Navbar';
import { Grid, Paper, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faUsers, faMoneyBill, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './Dashboard.css'
const Dashboard = () => {
  const data = [
    { month: 'Jan', sales: 2400, revenue: 2400 },
    { month: 'Feb', sales: 1398, revenue: 2210 },
    { month: 'Mar', sales: 9800, revenue: 2290 },
    { month: 'Apr', sales: 3908, revenue: 2000 },
    { month: 'May', sales: 4800, revenue: 2181 },
    { month: 'Jun', sales: 3800, revenue: 2500 },
    { month: 'Jul', sales: 4300, revenue: 2100 },
    { month: 'Aug', sales: 5300, revenue: 2800 },
    { month: 'Sep', sales: 6700, revenue: 3200 },
    { month: 'Oct', sales: 5400, revenue: 2600 },
    { month: 'Nov', sales: 6400, revenue: 3000 },
    { month: 'Dec', sales: 6900, revenue: 3200 },
  ];
  

  return (
    <div>
     

      <Container >
        <Row>
          <Col lg={2} className="d-none d-lg-block sidebar-wrapper">
            <Sidebar isOpen={false} />
          </Col>
          <Col lg={15} className="main-content">
            <Grid container spacing={3} sx={{mt:8}}>
              {/* Dashboard Summary Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={3} className="p-3 dash_card" style={{ height: '200px', marginTop: '5px' }}>
                  <FontAwesomeIcon icon={faChartBar} size="3x" style={{ marginBottom: '10px' }} className='dashb-icon'/>
                  <Typography variant="h6" gutterBottom style={{ marginBottom: '10px' }}>
                    Dashboard
                  </Typography>
                  <Typography variant="body1" style={{ marginBottom: '10px' }}>
                    Summary of dashboard activities.
                  </Typography>
                
                </Paper>
              </Grid>
              {/* Customer Summary Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={3} className="p-3 dash_card" style={{ height: '200px', marginTop: '5px' }} >
                  <FontAwesomeIcon icon={faUsers} size="3x" style={{ marginBottom: '10px' }} className='dashb-icon'/>
                  <Typography variant="h6" gutterBottom style={{ marginBottom: '10px' }}>
                    Customer
                  </Typography>
                  <Typography variant="body1" style={{ marginBottom: '10px' }}>
                    Summary of customer data.
                  </Typography>
                 
                </Paper>
              </Grid>
              {/* Adagu Summary Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={3} className="p-3 dash_card" style={{ height: '200px', marginTop: '5px' }}>
                  <FontAwesomeIcon icon={faMoneyBill} size="3x" style={{ marginBottom: '10px' }} className='dashb-icon'/>
                  <Typography variant="h6" gutterBottom style={{ marginBottom: '10px' }}>
                    Adagu
                  </Typography>
                  <Typography variant="body1" style={{ marginBottom: '10px' }}>
                    Summary of Adagu information.
                  </Typography>
                 
                </Paper>
              </Grid>
              {/* Payment Summary Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={3} className="p-3 dash_card" style={{ height: '200px', marginTop: '5px' }}>
                  <FontAwesomeIcon icon={faCreditCard} size="3x" style={{ marginBottom: '10px' }} className='dashb-icon'/>
                  <Typography variant="h6" gutterBottom style={{ marginBottom: '10px' }}>
                    Payment
                  </Typography>
                  <Typography variant="body1" style={{ marginBottom: '10px' }}>
                    Summary of payment details.
                  </Typography>
                 
                </Paper>
              </Grid>
            </Grid>
          </Col>
        </Row>
        <Container>
      <Grid container spacing={3} sx={{ mt: 5,mb:5 }}>
        {/* Sales Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="p-3 dash_card" style={{ height: '400px', marginTop: '5px' }}>
            <Typography variant="h6" gutterBottom style={{ marginBottom: '10px' }}>
              Sales (Monthly)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#d34141 " />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        {/* Revenue Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="p-3 dash_card" style={{ height: '400px', marginTop: '5px' }}>
            <Typography variant="h6" gutterBottom style={{ marginBottom: '10px' }}>
              Revenue (Monthly)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#d34141 " />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
      </Container>
    </div>
  );
};

export default Dashboard;
