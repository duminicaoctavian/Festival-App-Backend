const mongoose = require('mongoose')

var Artist = mongoose.model('Artist', {
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
  }
})

module.exports = {
  Artist
}
