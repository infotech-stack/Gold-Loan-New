const express = require('express');
const router = express.Router();
const LoanEntry = require('../models/loanEntry');

// Route to add a new loan entry
router.post('/add', async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    const newLoanEntry = new LoanEntry(req.body);
    await newLoanEntry.save();
    res.status(201).json(newLoanEntry);
  } catch (error) {
    console.error('Error saving loan entry:', error);
    res.status(500).json({ message: 'Failed to save loan entry', error });
  }
});
// Route to fetch all loan entries
router.get('/all', async (req, res) => {
  try {
    const loanEntries = await LoanEntry.find();
    res.status(200).json(loanEntries);
  } catch (error) {
    console.error('Error fetching loan entries:', error);
    res.status(500).json({ message: 'Failed to fetch loan entries', error });
  }
});

// Route to get the latest balance of a specific customer
router.get('/balance/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const latestEntry = await LoanEntry.findOne({ customerId }).sort({ paymentDate: -1 });

    if (!latestEntry) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ balance: latestEntry.balance });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ message: 'Failed to fetch balance', error });
  }
});

// Route to update the balance of a specific customer
router.put('/loanEntry/updateBalance/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { balance } = req.body;

    const result = await LoanEntry.findOneAndUpdate(
      { customerId },
      { $set: { balance } },
      { new: true }
    );

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    console.error("Error updating balance", error);
    res.status(500).json({ message: "Failed to update balance", error });
  }
});

// Route to get the latest balance for all customers
router.get('/balances', async (req, res) => {
  try {
    // Fetch the most recent entry for each customer
    const balances = await LoanEntry.aggregate([
      { $sort: { paymentDate: -1 } },
      {
        $group: {
          _id: "$customerId",
          balance: { $first: "$balance" },
          isClosed: { $first: "$isClosed" }
        }
      },
      // Include records even if balance is zero and ensure no unnecessary filters
    ]);

    // Format the results, ensuring that zero balances are displayed
    const formattedBalances = balances.map(b => ({
      customerId: b._id,
      balance: b.balance !== undefined ? b.balance : 0, // Handle undefined balances
      isClosed: b.isClosed !== undefined ? b.isClosed : false // Handle undefined isClosed
    }));

    console.log("Fetched Balances:", formattedBalances);
    res.status(200).json(formattedBalances);
  } catch (error) {
    console.error("Error fetching balances", error);
    res.status(500).json({ message: "Failed to fetch balances", error });
  }
});


// Route to get the latest balance of a specific customer
router.get('/balance/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const latestEntry = await LoanEntry.findOne({ customerId }).sort({ paymentDate: -1 });

    if (!latestEntry) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ 
      balance: latestEntry.balance, 
      isClosed: latestEntry.isClosed 
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ message: 'Failed to fetch balance', error });
  }
});

// Route to get loan entries by customer ID
// Route to get loan entries by customer ID
router.get('/loanEntry/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const loanEntries = await LoanEntry.find({ customerId });
    res.status(200).json(loanEntries);
  } catch (error) {
    console.error('Error fetching loan entries:', error);
    res.status(500).json({ message: 'Failed to fetch loan entries', error });
  }
});




// Route to handle fetching loan entries by customer ID
router.get('/:customerId', async (req, res) => {
  try {
    const loanEntries = await LoanEntry.find({ customerId: req.params.customerId });
    res.status(200).json(loanEntries);
  } catch (error) {
    console.error('Error fetching loan entries:', error);
    res.status(500).json({ message: 'Failed to fetch loan entries', error });
  }
});

module.exports = router;
