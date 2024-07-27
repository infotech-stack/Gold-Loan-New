const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');

// Route to add a new expense
router.post('/add', async (req, res) => {
  try {
    const { productName, date, totalRupees } = req.body;

    // Create a new expense document
    const newExpense = new Expense({
      productName,
      date,
      totalRupees,
    });

    // Save the expense to the database
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});
module.exports = router;
