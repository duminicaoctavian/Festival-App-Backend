let mongoose = require('mongoose')
let express = require('express')
let { Channel } = require('../models/channel')
let  { authenticateAsClient } = require('./../middleware/authenticate')

let router = express.Router()

let Route = {
	default: '/',
	byID: '/:id'
}
// TODO - only done by organizer
router.post(Route.default, (request, response) => {
	let channel = Channel({
		name: request.body.name,
		description: request.body.description
	})

	channel.save(error => {
		if (error) {
			response.status(500).json({ message: error })
		}
		response.status(200).send()
	})
})

router.get(Route.default, authenticateAsClient, (request, response) => {
	Channel.find({}, (error, channels) => {
		if (error) {
			response.status(500).json({ message: error })
		}
		response.status(200).json(channels)
	})
})

router.get(Route.byID, authenticateAsClient, (request, response) => {
	Channel.findById(request.params.id, (error, channel) => {
		if (error) {
			response.status(500).json({ message: error })
		}
		response.status(200).json(channel);
	})
})

// TODO - only done by organizer
router.delete(Route.byID, (request, response) => {
	Channel.remove({ _id: request.params.id }, (error, channel) => {
		if (error) {
			response.status(500).json({ message: error })
		}
		response.status(200).send()
	})
})

module.exports = router
