const mongoose = require('mongoose')
const User = require('./user.js')


const ObjectId = mongoose.Schema.Types.ObjectId

var locationSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  latitude: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  longitude: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  userId: {
    type: ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  images: [{
    image: {
      type: String,
      required: true
    }
  }]
})

module.exports = mongoose.model('Location', locationSchema)
