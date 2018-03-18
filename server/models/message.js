const mongoose = require('mongoose')
const User = require('./user.js')
const Channel = require('./channel.js')

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const messageSchema = new Schema({
  messageBody: {
    type: String,
    default: ""
  },
  timeStamp: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: ObjectId,
    ref: 'User'
  },
  channelId: {
    type: ObjectId,
    ref: 'Channel'
  },
  userName: {
    type: String,
    default: ""
  }
})

module.exports = mongoose.model('Message', messageSchema);
