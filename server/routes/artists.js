let express = require('express')
let mongoose = require('mongoose')
let moment = require('moment')
let Artist = require('../models/artist.js')
let router = express.Router()

var { authenticate } = require('./../middleware/authenticate.js')

router.post('/', (req, res) => {
	var dateString
	let momentTime = moment(req.body.time, 'hh:mm')
	let adjustedMomentTime = moment([1970, 0, 1]).hour(momentTime.hour()).minute(momentTime.minute())

	if ((req.body.time.localeCompare('00:00') >= 0) && (req.body.time.localeCompare('12:00') <= 0)) {
		adjustedMomentTime.add(1, 'day')
		dateString = adjustedMomentTime.format('DD-MM-YYYY HH:mm')
	} else {
		dateString = adjustedMomentTime.format('DD-MM-YYYY HH:mm')
	}

	var artist = new Artist({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		genre: req.body.genre,
		description: req.body.description,
		stage: req.body.stage,
		day: req.body.day,
		time: dateString,
		artistImage: req.body.artistImage
	})

	artist.save().then((doc) => {
		res.send(doc)
	}, (err) => {
		res.status(400).send(err)
	})
})

router.get('/', (req, res) => {
	Artist.find({}).sort('name').then((artists) => {
		res.send({ artists })
	}, (e) => {
		res.status(400).send(e)
	})
})

router.get('/:stage', (req, res) => {
	var stage = req.params.stage

	Artist.find({
		stage: stage,
	}).sort('name').then((artists) => {
		if (artists.length === 0) {
			return res.status(404).send()
		}
		res.send({ artists })
	}).catch((e) => {
		res.status(400).send()
	})
})

router.get('/:stage/:day', (req, res) => {
	var stage = req.params.stage
	var day = req.params.day

	Artist.find({
		stage: stage,
		day: day,
	}).sort('time').then((artists) => {
		if (artists.length === 0) {
			return res.status(404).send()
		}
		res.send({ artists })
	}).catch((e) => {
		res.status(400).send()
	})
})

module.exports = router
