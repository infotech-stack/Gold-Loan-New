import React, { useState } from 'react';
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBars, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../AuthContext';
import { Popover, Button, Avatar, Box, Typography } from '@mui/material';
import './Navbar.css';
import adminImage from './new adm.png';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import logo from './KRT Gold Finance Logo.jpeg'; 

const AppNavbar = ({ handleShowSidebar }) => {
  const navigate = useNavigate();
  const { adminId, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to log out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/');
      }
    });
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Navbar className='nav_bar' variant="dark" expand="lg" fixed="top">
      <Container fluid>
        <Row className="w-100 align-items-center">
          <Col xs="auto">
            <Nav className="d-lg-none">
              <Nav.Link onClick={handleShowSidebar}>
                <FontAwesomeIcon icon={faBars} />
              </Nav.Link>
            </Nav>
            <Navbar.Brand className="d-flex align-items-center">
              <img
                src={logo}
                alt="Logo"
                className="logo"
                style={{ height: '40px',width:'50px' ,marginRight: '10px' }} // Adjust the height and margin as needed
              />
            </Navbar.Brand>
          </Col>
          <Col className="text-center d-none d-lg-block">
            <Navbar.Brand className="nav-link haed">Jewellery Loan</Navbar.Brand>
          </Col>
          <Col xs="auto" className="ml-auto d-flex align-items-center">
            <div
              onClick={open ? handlePopoverClose : handlePopoverOpen}
              className="admin-info d-flex align-items-center"
              style={{
                cursor: 'pointer',
                marginRight: '10px', // Adjust margin as needed
              }}
            >
              <FontAwesomeIcon icon={faUserShield} className='icon-shield' />
              {open ? <ArrowDropUpIcon className='new-icon' /> : <ArrowDropDownIcon  className='new-icon' />}
            </div>
            <Popover sx={{mt:2}}
              open={open}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <Box p={2}>
                <Box display="flex" alignItems="center">
                  <Avatar alt="Admin" src={adminImage} className='image-adm' />
                  <Typography variant="body1" ml={4}>Admin : {adminId}</Typography>
                </Box>
                <Box mt={2} display="flex" justifyContent="space-between">
                  <Button variant="outlined" color="error" onClick={handlePopoverClose} className='nav-button2'>
                    Change Password
                  </Button>
                  <Button variant="outlined" color='warning' onClick={handleLogout} className='nav-button1'>
                    Sign Out
                  </Button>
                </Box>
              </Box>
            </Popover>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
