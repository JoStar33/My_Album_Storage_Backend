const mongoose = require('mongoose');

const { Schema } = mongoose;

const { Types: { ObjectId } } = Schema;

const albumSchema = new Schema({
  name: {
    type: String,
    require: true
  }, 
  artist: {
    type: String,
    require: true
  }, 
  image: {
    type: String,
    require: true
  },
  header: {
    type: String,
    require: true
  }, 
  description: {
    type: String,
    allowNull: true,
  },
  created_at: {
    type: Date,
    default: Date.NOW,
    allowNull: true,
  },
  owner: {
    type: ObjectId,
    required: true,
    ref: 'User',
  }
});


module.exports = {
  Album: mongoose.model('AdminAlbum', albumSchema),
  albumSchema
};