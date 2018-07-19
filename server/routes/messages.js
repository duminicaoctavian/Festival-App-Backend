let mongoose = require('mongoose')
let express = require('express')
let { Message } = require('../models/message')
let { authenticateAsClient } = require('./../middleware/authenticate.js')

let router = express.Router()

let Route = {
	default: '/',
	byChannelID: '/:channelID',
	byID: '/:id'
}

let Feedback = {
	messageCreateSuccess: 'Message created successfully!'
}

router.post(Route.default, authenticateAsClient, (request, response) => {
	let message = new Message({
		body: request.body.body,
		userID: request.body.userID,
		channelID: request.body.channelID,
		username: request.body.username
	})

	message.save(error => {
		if (error) {
			response.status(500).json({ message: error })
		}
		response.status(200).json({ message: Feedback.messageCreateSuccess })
	})
})

router.get(Route.byChannelID, authenticateAsClient, (request, response) => {
	Message.find({ 'channelID': request.params.channelID }).sort('date').then((messages) => {
		response.send(messages)
	}, (error) => {
		response.status(400).send(error)		
	})
})

router.delete(Route.byID, authenticateAsClient, (request, response) => {
	Message.remove({ _id: request.params.id }, (error, result) => {
		if (error) {
			response.status(500).json({ message: error })
		}
		response.status(200).send()
	})
})

module.exports = router
