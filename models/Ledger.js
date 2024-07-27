const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ledgerSchema = new Schema({
  customerId: { type: String, required: true },
  loanNumber: { type: String, required: true },
  date: { type: Date, required: true },
  jlNumber: { type: String, required: true },
  customerName: { type: String, required: true },
  mobileNumber1: { type: String, required: true },
  mobileNumber2: { type: String },
  landmark: { type: String, required: true },
  address: { type: String, required: true },
  jDetails: { type: String, required: true },
  quality: { type: String, required: true },
  quantity: { type: String, required: true },
  iw: { type: String, required: true },
  gw: { type: String, required: true },
  nw: { type: String, required: true },
  schema: { type: String, required: true },
  percent: { type: String, required: true },
  loanAmount: { type: String, required: true },
  proofFilePath: { type: String } 
});

module.exports = mongoose.model('Ledger', ledgerSchema);
