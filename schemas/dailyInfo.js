const mongoose = require('mongoose');

const { Schema } = mongoose;

const dailyInfoSchema = new Schema({
  accessUser: {
    type: Number,
    require: true,
    default: 0,
  },
  makedAlbum: {
    type: Number,
    require: true,
    default: 0,
  },
  updated_at: {
    type: Date,
    default: Date.NOW,
    require: true
  }
});

module.exports = mongoose.model('DailyInfo', dailyInfoSchema);