const mongoose = require('mongoose');

const GoldLoanEntrySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  fatherName: { type: String, required: true },
  address: { type: String, required: true },
  aadhaarNumber: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  occupation: { type: String, required: true },
  goldLoanNo: { type: String, required: true },
  interestRate: { type: Number, required: true },
  tenure: { type: String, required: true },
  amount: { type: Number, required: true },
  goldSaleNo: { type: String, required: true },
  saleAmount: { type: Number, required: true },
  grossWeight: { type: Number, required: true },
  netWeight: { type: Number, required: true },
  otherBankName: { type: String, required: true },
  otherBankAmount: { type: Number, required: true },
  pledgeAmount: { type: Number, required: true },
  serviceCharge: { type: Number, required: true },
  amountGiven: { type: Number, required: true },
  goodsDescription: { type: String, required: true },
  quantity: { type: Number, required: true },
  purity: { type: String, required: true }
});

module.exports = mongoose.model('GoldLoanEntry', GoldLoanEntrySchema);
