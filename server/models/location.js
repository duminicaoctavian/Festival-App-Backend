let mongoose = require('mongoose')
let validator = require('validator')
let { ModelName } = require('./../utils/constants')

let ObjectId = mongoose.Schema.Types.ObjectId

let Reference = {
	user: 'User'
}

let ErrorMessage = {
	URL: '{VALUE} is not a valid URL.',
	phone: '{VALUE} is not a valid phone number.'
}

var LocationSchema = mongoose.Schema({
	latitude: {
		type: Number,
		required: true
	},
	longitude: {
		type: Number,
		required: true
	},
	userID: {
		type: ObjectId,
		ref: Reference.user
	},
	title: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	address: {
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
	price: {
		type: Number,
		required: true,
	},
	phone: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		validate: {
			validator: validator.isMobilePhone,
			message: ErrorMessage.phone
		}
	},
	images: [{
		type: String,
		required: false,
		trim: true,
		validate: {
			validator: validator.isURL,
			message: ErrorMessage.URL
		}
	}]
})

let Location = mongoose.model(ModelName.location, LocationSchema)

module.exports = {
	Location
}
