let express = require('express')
let mongoose = require('mongoose')
let moment = require('moment')
let { authenticateAsClient } = require('./../middleware/authenticate')
let { Artist } = require('../models/artist')
let { DateConstants } = require('./../utils/constants')

let router = express.Router()

let Route = {
	default: '/',
	byStage: '/:stage',
	byStageAndDay: '/:stage/:day'
}

// TODO - operation only done by admin
router.post(Route.default, (request, response) => {
	let dateTime = request.body.date.substring(12, 17)
	let momentDate = moment(request.body.date, DateConstants.dateFormatter)

	if (dateTime.localeCompare(DateConstants.endOfDayTime) <= 0) {
		momentDate.add(1, DateConstants.dayUnitOfTime)
	}

	let artist = new Artist({
		_id: new mongoose.Types.ObjectId(),
		name: request.body.name,
		genre: request.body.genre,
		description: request.body.description,
		stage: request.body.stage,
		day: request.body.day,
		date: momentDate.toDate(),
		artistImageURL: request.body.artistImageURL
	})

	artist.save().then((artist) => {
		response.send(artist)
	}, (error) => {
		response.status(400).send(error)
	})
})

router.get(Route.default, authenticateAsClient, (request, response) => {
	Artist.find({}).sort('name').then((artists) => {
		response.send({ artists })
	}, (error) => {
		response.status(400).send(error)
	})
})

router.get(Route.byStage, authenticateAsClient, (request, response) => {
	let stage = request.params.stage

	Artist.find({ stage }).sort('name').then((artists) => {
		if (artists.length === 0) {
			return response.status(404).send()
		}
		response.send({ artists })
	}).catch((error) => {
		response.status(400).send()
	})
})

router.get(Route.byStageAndDay, authenticateAsClient, (request, response) => {
	let stage = request.params.stage
	let day = request.params.day

	Artist.find({ stage, day }).sort('date').then((artists) => {
		if (artists.length === 0) {
			return response.status(404).send()
		}
		response.send({ artists })
	}).catch((error) => {
		response.status(400).send()
	})
})

module.exports = router
