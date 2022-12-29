const mongoose = require('mongoose');
const { topsterAlbumSchema } = require('./topsterAlbum');

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
  albums: [topsterAlbumSchema],
  owner: {
    type: ObjectId,
    required: true,
    ref: 'User',
  }
});

module.exports = mongoose.model('Topster', topsterSchema);