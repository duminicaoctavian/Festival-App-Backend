const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const channelSchema = new Schema({
	name: {
		type: String,
		default: ""
	},
	description: {
		type: String,
		default: ""
	}
})

module.exports = mongoose.model('Channel', channelSchema);
