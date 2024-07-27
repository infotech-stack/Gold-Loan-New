// routes/Admin.js

const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new admin
router.post('/register', async (req, res) => {
  try {
    const { name, designation, branch, phoneNumber, adminId, password, permissions } = req.body;

    // Check if admin ID already exists
    const existingAdmin = await Admin.findOne({ adminId });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin ID already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      designation,
      branch,
      phoneNumber,
      adminId,
      password: hashedPassword,
      permissions,
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error('Error creating admin:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { adminId, password } = req.body;

    // Check if the admin ID exists
    const admin = await Admin.findOne({ adminId });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid admin ID or password' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid admin ID or password' });
    }

    // Set session data or generate JWT token
    // For JWT token generation, you would typically do something like this:
    const payload = {
      admin: {
        id: admin.id,
        adminId: admin.adminId
      }
    };

    jwt.sign(payload, 'jwtSecret', { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({
        success: true,
        token,
        permissions: admin.permissions // Example: Get permissions from admin document
      });
    });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch permissions for a specific admin
router.get('/:adminId/permissions', async (req, res) => {
  const { adminId } = req.params;

  try {
    const admin = await Admin.findOne({ adminId });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const permissions = admin.permissions;
    res.status(200).json({ permissions });
  } catch (error) {
    console.error('Error fetching permissions:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.post('/login', async (req, res) => {
  console.log('Login request body:', req.body);
  try {
    const { adminId, password } = req.body;

    if (!adminId || !password) {
      return res.status(400).json({ message: 'Admin ID and password are required' });
    }

    const admin = await Admin.findOne({ adminId });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', adminId });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;
