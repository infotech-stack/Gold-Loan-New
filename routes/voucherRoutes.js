const express = require('express');
const router = express.Router();
const Voucher = require('../models/voucher');
const upload = require('../middlewares/upload');

router.post('/add', upload.fields([{ name: 'receivedSign', maxCount: 1 }, { name: 'authorizedSign', maxCount: 1 }]), async (req, res) => {
  try {
    const { name, amount, rupeesInWords, purposeOfAmount, date } = req.body;
    const receivedSignPath = req.files['receivedSign'][0].path;
    const authorizedSignPath = req.files['authorizedSign'][0].path;

    const newVoucher = new Voucher({
      name,
      amount,
      rupeesInWords,
      purposeOfAmount,
      receivedSignPath,
      authorizedSignPath,
      date, // Include date field
    });

    await newVoucher.save();
    res.status(201).json(newVoucher);
  } catch (error) {
    console.error('Error adding voucher:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
router.get('/all', async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.json(vouchers);
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
module.exports = router;
