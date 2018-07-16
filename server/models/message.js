let mongoose = require('mongoose')
let User = require('./user.js')
let Channel = require('./channel.js')

let Schema = mongoose.Schema;
let ObjectId = mongoose.Schema.Types.ObjectId;

let messageSchema = new Schema({
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
