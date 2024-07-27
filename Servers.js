const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: 'your_secret_key', // Replace with a long random string (keep it secret)
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// MongoDB connection setup
const mongoURI = 'mongodb://localhost:27017/Gold_loan';
mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const adaguRouter = require('./routes/Adagu');
const adminRouter = require('./routes/Admin');
const rootadminRouter = require('./routes/rootadmin'); // Check the case here
const voucherRoutes = require('./routes/voucherRoutes');
const ledgerRouter = require('./routes/ledger'); // Add this line
const expensesRouter = require('./routes/expenses'); 
const salaryRoutes = require('./routes/salary');
const reportRoutes = require('./routes/report'); // Add this line
const schemaRoutes = require('./routes/schemaRoutes');
const loanEntryRoutes = require('./routes/loanEntryRoutes');
const customerRoutes = require('./routes/customer');
const goldLoanEntryRoutes = require('./routes/goldLoanEntry');

app.use('/api/repledge', goldLoanEntryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/schemas', schemaRoutes);
app.use('/api/loanEntry', loanEntryRoutes);
app.use('/api/expenses', expensesRouter);
app.use('/api/adagu', adaguRouter);
app.use('/api/admins', adminRouter);
app.use('/api/rootadmin', rootadminRouter);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/ledger', ledgerRouter);
app.use('/api/salary', salaryRoutes);
app.use('/api/report', reportRoutes); // Add this line

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
