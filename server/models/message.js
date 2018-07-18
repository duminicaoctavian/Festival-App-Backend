let mongoose = require('mongoose')
let validator = require('validator')
let { ModelName } = require('./../utils/constants')

let Reference = {
	user: 'User',
	channel: 'Channel'
}

let ErrorMessage = {
	username: '{VALUE} is not a valid username. Only alphanumeric characters are allowed.'
}

let ObjectID = mongoose.Schema.Types.ObjectId

let MessageSchema = mongoose.Schema({
	body: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		maxlength: 255
	},
	date: {
		type: Date,
		default: Date.now
	},
	username: {
		type: String,
		required: true,
		trim: true,
		minlength: 6,
		validate: {
			validator: validator.isAlphanumeric,
			message: ErrorMessage.username
		}
	},
	userID: {
		type: ObjectID,
		ref: Reference.user
	},
	channelID: {
		type: ObjectID,
		ref: Reference.channel
	}
})

let Message = mongoose.model(ModelName.message, MessageSchema)

module.exports = {
	Message
}
