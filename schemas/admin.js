const mongoose = require('mongoose');

const { Schema } = mongoose;

const adminSchema = new Schema({
  email: {
    type: String,
    allowNull: true,
    unique: true,
  },
  password: {
    type: String,
    allowNull: true,
  },
  provider: {
    type: String,
    allowNull: false,
    default: 'local',
  }
});

module.exports = mongoose.model('Admin', adminSchema);
