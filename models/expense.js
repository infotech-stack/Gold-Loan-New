const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  totalRupees: { type: Number, required: true },
});

module.exports = mongoose.model('Expense', ExpenseSchema);
