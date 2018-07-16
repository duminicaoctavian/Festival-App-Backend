let mongoose = require('mongoose')

let newsSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	title: {
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
	timeStamp: {
		type: Date,
		default: Date.now
	},
	url: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	}
})

module.exports = mongoose.model('News', newsSchema)
