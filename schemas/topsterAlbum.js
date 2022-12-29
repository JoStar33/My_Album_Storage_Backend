const { albumSchema } = require('./album');


const mongoose = require('mongoose');

const { Schema } = mongoose;

const topsterAlbumSchema = new Schema({
  ...albumSchema.obj,
  position: {
    type: Number,
    require: true
  }
});

module.exports = {
  topsterAlbumSchema,
}