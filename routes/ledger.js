const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Ledger = require('../models/Ledger');
const fs = require('fs');

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Set the upload directory correctly
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to the filename
  }
});

const upload = multer({ storage: storage });

// Route to handle file upload and create ledger entry
router.post('/add', upload.single('proof'), async (req, res) => {
  try {
    const { customerId, loanNumber, date, jlNumber, customerName, mobileNumber1, mobileNumber2, landmark, address, jDetails, quality, quantity, iw, gw, nw, schema, percent, loanAmount } = req.body;
    const proofFilePath = req.file ? req.file.path : null;

    const newLedger = new Ledger({
      customerId,
      loanNumber,
      date,
      jlNumber,
      customerName,
      mobileNumber1,
      mobileNumber2,
      landmark,
      address,
      jDetails,
      quality,
      quantity,
      iw,
      gw,
      nw,
      schema,
      loanAmount,
      percent,
      proofFilePath
    });

    const savedLedger = await newLedger.save();
    res.status(201).json(savedLedger);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const ledgers = await Ledger.find();
    res.status(200).json(ledgers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/latest_loan_number', async (req, res) => {
  try {
    const latestEntry = await Ledger.findOne({}, { loanNumber: 1 }, { sort: { loanNumber: -1 } });
    if (!latestEntry) {
      res.json({ latestLoanNumber: 'KRT001' });
    } else {
      const currentLoanNumber = latestEntry.loanNumber;
      const numericPart = parseInt(currentLoanNumber.slice(3));
      const nextLoanNumber = `KRT${(numericPart + 1).toString().padStart(3, '0')}`;
      res.json({ latestLoanNumber: nextLoanNumber });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/next_jewel_number', async (req, res) => {
  try {
    const latestEntry = await Ledger.findOne({}, { jlNumber: 1 }, { sort: { jlNumber: -1 } });
    if (!latestEntry) {
      res.json({ nextJewelNumber: '001' });
    } else {
      const currentJewelNumber = latestEntry.jlNumber;
      const numericPart = parseInt(currentJewelNumber, 10);
      const nextJewelNumber = (numericPart + 1).toString().padStart(3, '0');
      res.json({ nextJewelNumber });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:customerId', async (req, res) => {
  const { customerId } = req.params;
  try {
    const ledger = await Ledger.findOne({ customerId });
    if (ledger) {
      res.status(200).json(ledger);
    } else {
      res.status(404).json({ message: 'Ledger entry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Add this route in your existing routes
// Add this route in your existing routes
router.get('/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.resolve(__dirname, '../uploads', filename); // Use path.resolve for absolute path

  console.log(`Requested file path: ${filePath}`); // Log the requested file path

  if (fs.existsSync(filePath)) {
    res.download(filePath, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ message: 'Error downloading file' });
      }
    });
  } else {
    console.error('File not found:', filePath); // Log file not found error
    res.status(404).json({ message: 'File not found' });
  }
});



module.exports = router;
