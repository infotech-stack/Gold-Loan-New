const express = require('express');
const router = express.Router();
const GoldLoanEntry = require('../models/GoldLoanEntry');

// Add a new gold loan entry
router.post('/add', async (req, res) => {
  try {
    console.log('Request Payload:', req.body);
    const entry = new GoldLoanEntry(req.body);
    await entry.save();
    res.status(201).send(entry);
  } catch (error) {
    console.error('Error adding entry:', error);
    res.status(500).send({ error: error.message });
  }
});

// Other routes...

module.exports = router;
