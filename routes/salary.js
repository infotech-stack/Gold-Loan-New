const express = require('express');
const router = express.Router();
const Salary = require('../models/salary');

// Route: POST /api/salary/add
// Description: Add new salary entry
router.post('/add', async (req, res) => {
  const { employeeName, designation, date, salaryAmount } = req.body;

  try {
    const newSalary = new Salary({
      employeeName,
      designation,
      date,
      salaryAmount,
    });

    await newSalary.save();
    res.status(201).json(newSalary); // Respond with the saved salary data
  } catch (error) {
    console.error('Error adding salary:', error);
    res.status(500).json({ error: 'Failed to add salary entry' });
  }
});
router.get('/', async (req, res) => {
  try {
    const salaries = await Salary.find();
    res.status(200).json(salaries);
  } catch (error) {
    console.error('Error fetching salaries:', error);
    res.status(500).json({ error: 'Failed to fetch salary entries' });
  }
});

module.exports = router;
