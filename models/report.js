const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  jewelNo: { type: String, default: '' },
  customerName: { type: String, default: '' },
  date: { type: Date, default: null },
  customerId: { type: String, default: '' },
  loanNo: { type: String, default: '' },
  mobileNumber: { type: String, default: '' },
  address: { type: String, default: '' },
  loanAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  items: { type: String, default: '' },
  quality: { type: String, default: '' },
  quantity: { type: Number, default: 0 },
  totalWeightGms: { type: Number, default: 0 },
  gross: { type: Number, default: 0 },
  net: { type: Number, default: 0 },
  customerSign1: { type: String, default: '' }, // URL or path to the file
  cashReceivedRs: { type: Number, default: 0 },
  rupeesInWords: { type: String, default: '' },
  paymentNo: { type: String, default: '' },
  paymentDate: { type: Date, default: null },
  receiptNo: { type: String, default: '' },
  noOfDays: { type: Number, default: 0 },
  interestPrinciple: { type: Number, default: 0 },
  balancePrinciple: { type: Number, default: 0 },
  remarks: { type: String, default: '' },
  customerSign: { type: String, default: '' }, // URL or path to the file
  cashierSign: { type: String, default: '' }, // URL or path to the file
  closedate: { type: Date, default: null }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
