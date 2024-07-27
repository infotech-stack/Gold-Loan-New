const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const RootAdminSchema = new mongoose.Schema({
  rootAdminId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash password before saving
RootAdminSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password') || this.isNew) {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('RootAdmin', RootAdminSchema);
