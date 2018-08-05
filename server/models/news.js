let mongoose = require('mongoose')
let validator = require('validator')
let { ModelName } = require('./../utils/constants')

let ErrorMessage = {
	URL: '{VALUE} is not a valid URL.'
}

let NewsSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
		minlength: 10,
		trim: true
	},
	description: {
		type: String,
		required: true,
		minlength: 10,
		trim: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	videoURL: {
		type: String,
		required: false,
		trim: true,
		validate: {
			validator: validator.isURL,
			message: ErrorMessage.URL
		}
	},
	imageURL: {
		type: String,
		required: false,
		trim: true,
		validate: {
			validator: validator.isURL,
			message: ErrorMessage.URL
		}
	}
})

let News = mongoose.model(ModelName.news, NewsSchema)

module.exports = {
	News
}
