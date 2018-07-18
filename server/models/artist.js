let mongoose = require('mongoose')
let validator = require('validator')
let { ModelName } = require('./../utils/constants')

let ErrorMessage = {
	stage: '{VALUE} is not a valid stage name.',
	URL: '{VALUE} is not a valid URL.'
}

let ArtistSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true
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
		minlength: 50,
		trim: true
	},
	stage: {
		type: String,
		required: true,
		minlength: 4,
		trim: true,
		validate: {
			validator: validator.isAlpha,
			message: ErrorMessage.stage
		}
	},
	day: {
		type: Number,
		required: true,
		trim: true,
		min: 1,
		max: 4
	},
	date: {
		type: Date,
		required: true,
		trim: true
	},
	artistImageURL: {
		type: String,
		required: true,
		trim: true,
		validate: {
			validator: validator.isURL,
			message: ErrorMessage.URL
		}
	}
})

let Artist = mongoose.model(ModelName.artist, ArtistSchema)

module.exports = {
	Artist
}
