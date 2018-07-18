let mongoose = require('mongoose')
let validator = require('validator')
let { ModelName } = require('./../utils/constants')

let ErrorMessage = {
	name: '{VALUE} is not a valid name for the channel.'
}

let ChannelSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 2,
		trim: true,
		validate: {
			validator: validator.isAlphanumeric,
			message: ErrorMessage.name
		}
	},
	description: {
		type: String,
		required: false,
		minlength: 2,
		maxlength: 50,
		trim: true
	}
})

let Channel = mongoose.model(ModelName.channel, ChannelSchema)

module.exports = {
	Channel
}
