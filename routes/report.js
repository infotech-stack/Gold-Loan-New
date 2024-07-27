const express = require('express');
const multer = require('multer');
const path = require('path');
const Report = require('../models/report');  // Ensure correct path to the Report model

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST route to submit the form data
router.post('/', upload.fields([
  { name: 'authorizedFile', maxCount: 1 },
  { name: 'customersign', maxCount: 1 },
  { name: 'cashiersign', maxCount: 1 },
]), async (req, res) => {
  try {
    console.log('Files:', req.files);  // Debug: Log the files object
    console.log('Body:', req.body);    // Debug: Log the request body

    // Extract file paths safely with default empty strings if files are not present
    const authorizedFilePath = req.files && req.files.authorizedFile ? req.files.authorizedFile[0].path : '';
    const customerSignPath = req.files && req.files.customersign ? req.files.customersign[0].path : '';
    const cashierSignPath = req.files && req.files.cashiersign ? req.files.cashiersign[0].path : '';

    // Convert fields to numbers where appropriate
    const totalAmount = parseFloat(req.body.totalAmount) || 0;  // Ensure it’s a number
    const loanAmount = parseFloat(req.body.loanAmount) || 0;
    const quantity = parseFloat(req.body.quantity) || 0;
    const totalWeightGms = parseFloat(req.body.totalWeightGms) || 0;
    const gross = parseFloat(req.body.gross) || 0;
    const net = parseFloat(req.body.net) || 0;
    const cashReceivedRs = parseFloat(req.body.cashReceivedRs) || 0;
    const interestPrinciple = parseFloat(req.body.interestPrinciple) || 0;
    const balancePrinciple = parseFloat(req.body.balancePrinciple) || 0;

    const newReport = new Report({
      jewelNo: req.body.jewelNo,
      customerName: req.body.customerName,
      date: req.body.date,
      customerId: req.body.customerId,
      loanNo: req.body.loanNo,
      mobileNumber: req.body.mobileNumber,
      address: req.body.address,
      loanAmount: loanAmount,
      totalAmount: totalAmount,
      items: req.body.items,
      quality: req.body.quality,
      quantity: quantity,
      totalWeightGms: totalWeightGms,
      gross: gross,
      net: net,
      customerSign1: authorizedFilePath,
      cashReceivedRs: loanAmount,
      rupeesInWords: req.body.rupeesInWords,
      paymentNo: req.body.paymentNo,
      paymentDate: req.body.paymentDate,
      receiptNo: req.body.receiptNo,
      noOfDays: req.body.noOfDays,
      interestPrinciple: interestPrinciple,
      balancePrinciple: balancePrinciple,
      remarks: req.body.remarks,
      customerSign: customerSignPath,
      cashierSign: cashierSignPath,
      closedate: req.body.closedate,
    });

    await newReport.save();
    res.status(201).json({ message: 'Report saved successfully' });
  } catch (error) {
    console.error('Error saving report:', error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
