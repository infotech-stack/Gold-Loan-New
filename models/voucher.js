const mongoose = require('mongoose');

const VoucherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: String, required: true },
  rupeesInWords: { type: String, required: true },
  purposeOfAmount: { type: String, required: true },
  receivedSignPath: { type: String, required: true },
  authorizedSignPath: { type: String, required: true },
  date: { type: Date, default: Date.now }, // New date field
});

module.exports = mongoose.model('Voucher', VoucherSchema);
