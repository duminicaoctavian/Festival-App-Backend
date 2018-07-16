let mongoose = require('mongoose')
let bodyParser = require('body-parser')
let Message = require('../models/message.js')
let express = require('express')
let router = express.Router()

var { authenticate } = require('./../middleware/authenticate.js')

router.post('/', (req, res) => {
	let newMessage = new Message()
	newMessage.messageBody = req.body.messageBody
	newMessage.userId = req.body.userId
	newMessage.channelId = req.body.channelId
	newMessage.userName = req.body.userName

	newMessage.save(err => {
		if (err) {
			res.status(500).json({ message: err })
		}
		res.status(200).json({ message: 'Message saved successfully' })
	})
})

router.get('/:channelId', (req, res) => {
	Message
		.find({ 'channelId': req.params.channelId }).sort('timeStamp').then((messages) => {
			res.send(messages)
		}, (e) => {
			res.status(400).send(e)
		})
})

router.delete('/:id', (req, res) => {
	Message.remove({
		_id: req.params.id
	}, (err, message) => {
		if (err) {
			res.status(500).json({ message: err })
		}
		res.status(200).json({ message: 'Message Successfully Removed' })
	})
})

module.exports = router
