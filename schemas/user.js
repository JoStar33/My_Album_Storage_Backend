const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    allowNull: true,
    unique: true,
  },
  nick: {
    type: String,
    allowNull: false,
  },
  password: {
    type: String,
    allowNull: true,
  },
  provider: {
    type: String,
    allowNull: false,
    default: 'local',
  },
  snsId: {
    type: String,
    allowNull: true,
  },
  created_at: {
    type: Date,
    default: Date.NOW,
  },
  updated_at: {
    type: Date,
    allowNull: true,
  },
  deleted_at: {
    type: Date,
    default: Date.NOW,
    allowNull: true,
  },
  admin: {
    type: Boolean,
    default: false,
    allowNull: false,
  }
});

module.exports = mongoose.model('User', userSchema);
