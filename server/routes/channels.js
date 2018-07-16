const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Channel = require('../models/channel.js')
const express = require('express')
const router = express.Router()

var { authenticate } = require('./../middleware/authenticate.js')

router.post('/', (req, res) => {
	let newChannel = new Channel();
	newChannel.name = req.body.name;
	newChannel.description = req.body.description;

	newChannel.save(err => {
		if (err) {
			res.status(500).json({ message: err })
		}
		res.status(200).json({ message: 'Channel saved successfully' })
	})
})

router.get('/', (req, res) => {
	Channel.find({}, (err, channels) => {
		if (err) {
			res.status(500).json({ message: err })
		}
		res.status(200).json(channels);
	})
})

router.get('/:id', (req, res) => {
	Channel.findById(req.params.id, (err, channel) => {
		if (err) {
			res.status(500).json({ message: err })
		}
		res.status(200).json(channel);
	})
})

router.delete('/:id', (req, res) => {
	Channel.remove({
		_id: req.params.id
	}, (err, channel) => {
		if (err) {
			res.status(500).json({ message: err })
		}
		res.status(200).json({ message: 'Channel Successfully Removed' })
	})
})

module.exports = router
