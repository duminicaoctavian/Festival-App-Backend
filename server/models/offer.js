let mongoose = require('mongoose')
let validator = require('validator')
let { ModelName } = require('./../utils/constants')

let ObjectId = mongoose.Schema.Types.ObjectId

let Reference = {
	user: 'User'
}

let ErrorMessage = {
	URL: '{VALUE} is not a valid URL.'
}

let OfferSchema = mongoose.Schema({
    userID: {
        type: ObjectId,
        ref: Reference.user
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 10
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 50
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    datePosted: {
		type: Date,
		default: Date.now
	},
    companyImageURL: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: validator.isURL,
            message: ErrorMessage.URL
        }
    }
})

let Offer = mongoose.model(ModelName.offer, OfferSchema)

module.exports = {
	Offer
}