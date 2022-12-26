const mongoose = require('mongoose');
const { albumSchema } = require('./album');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;

const topsterSchema = new Schema({
  name: {
    type: String,
    require: true
  }, 
  type: {
    type: String,
    require: true,
    default: "3x3"
  },
  albums: [albumSchema],
  owner: {
    type: ObjectId,
    required: true,
    ref: 'User',
  }
});

module.exports = mongoose.model('Topster', topsterSchema);