const express = require('express')
const mongoose = require('mongoose')
const Location = require('../models/location.js')
const router = express.Router()

var { authenticate } = require('./../middleware/authenticate.js')

router.post('/', (req, res) => {

	var location = new Location({
		_id: new mongoose.Types.ObjectId(),
		latitude: req.body.latitude,
		longitude: req.body.longitude,
		userId: req.body.userId,
		title: req.body.title,
		address: req.body.address,
		description: req.body.description,
		images: req.body.images
	})

	location.save().then((doc) => {
		res.send(doc)
	}, (err) => {
		res.status(400).send(err)
	})
})

router.get('/', (req, res) => {
	Location.find({}).then((locations) => {
		res.send({ locations })
	}, (e) => {
		res.status(400).send(e)
	})
})

module.exports = router
