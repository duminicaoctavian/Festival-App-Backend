let mongoose = require('mongoose')
let validator = require('validator')
let { ModelName } = require('./../utils/constants')

let ErrorMessage = {
	URL: '{VALUE} is not a valid URL.',
	category: '{VALUE} is not a valid category name.'
}

let ProductSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 4,
		trim: true
	},
	price: {
		type: Number,
		required: true
	},
	images: [{
		type: String,
		required: false,
		trim: true,
		validate: {
			validator: validator.isURL,
			message: ErrorMessage.URL
		}
	}],
	category: {
		type: String,
		required: true,
		minlength: 2,
		trim: true,
		validate: {
			validator: validator.isAlpha,
			message: ErrorMessage.category
		}
	}
})

let Product = mongoose.model(ModelName.product, ProductSchema)

module.exports = {
	Product
}
