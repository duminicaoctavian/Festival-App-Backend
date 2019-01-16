let mongoose = require('mongoose')
let validator = require('validator')
let { ModelName } = require('./../utils/constants')

let ObjectId = mongoose.Schema.Types.ObjectId

let Reference = {
    offer: 'Offer',
    user: 'User'
}

let ErrorMessage = {
	URL: '{VALUE} is not a valid URL.'
}

let ApplicationSchema = mongoose.Schema({
    offerID: {
        type: ObjectId,
        ref: Reference.offer
    },
    resumeURL: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: validator.isURL,
            message: ErrorMessage.URL
        }
    },
    projects: {
        type: String,
        required: true,
        trim: true
    },
    userID: {
        type: ObjectId,
        ref: Reference.user
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    dateApplied: {
		type: Date,
		default: Date.now
    },
    companyID: {
        type: ObjectId,
        ref: Reference.user
    }
})

let Application = mongoose.model(ModelName.application, ApplicationSchema)

module.exports = {
	Application
}