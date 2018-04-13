const mongoose = require('mongoose')

const artistSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  genre: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  description: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  stage: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  day: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  time: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
})

module.exports = mongoose.model('Artist', artistSchema)
