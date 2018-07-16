let mongoose = require('mongoose')
let Schema = mongoose.Schema;

let channelSchema = new Schema({
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
