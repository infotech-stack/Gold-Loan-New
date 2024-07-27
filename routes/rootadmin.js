const express = require('express');
const router = express.Router();
const RootAdmin = require('../models/rootadmin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create a new root admin
// Register route for root admins
router.post('/registers', async (req, res) => {
  try {
    const { rootAdminId, password } = req.body;

    if (!rootAdminId || !password) {
      return res.status(400).json({ message: 'Root Admin ID and password are required' });
    }

    const existingRootAdmin = await RootAdmin.findOne({ rootAdminId });
    if (existingRootAdmin) {
      return res.status(400).json({ message: 'Root Admin ID already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newRootAdmin = new RootAdmin({ rootAdminId, password: hashedPassword });
    await newRootAdmin.save();

    res.status(201).json({ message: 'Root Admin created successfully' });
  } catch (error) {
    console.error('Error creating root admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login route for root admins
router.post('/logins', async (req, res) => {
  try {
    const { rootAdminId, password } = req.body;

    if (!rootAdminId || !password) {
      return res.status(400).json({ message: 'Root Admin ID and password are required' });
    }

    const rootAdmin = await RootAdmin.findOne({ rootAdminId });
    if (!rootAdmin) {
      return res.status(400).json({ message: 'Invalid Root Admin ID or password' });
    }

    const isMatch = await bcrypt.compare(password, rootAdmin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Root Admin ID or password' });
    }

    // Create a token (optionally, you can add token expiration)
    const token = jwt.sign({ id: rootAdmin._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;


module.exports = router;
