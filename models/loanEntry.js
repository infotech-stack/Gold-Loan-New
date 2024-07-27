
const mongoose = require('mongoose');

const loanEntrySchema = new mongoose.Schema({
  paymentDate: { type: String, required: true },
  customerId: { type: String, required: true },
  noOfDays: { type: Number, required: true },
  interestPrinciple: { type: Number, required: true },
  interestamount: { type: Number, required: true },
  balance: { type: Number, required: true },

});

module.exports = mongoose.model('LoanEntry', loanEntrySchema);
