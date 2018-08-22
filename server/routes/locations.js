let express = require('express')
let mongoose = require('mongoose')
var { authenticateAsClient } = require('./../middleware/authenticate')
let { Location } = require('../models/location')

let router = express.Router()

let Route = {
	default: '/'
}

router.post(Route.default, authenticateAsClient, (request, response) => {

	let location = new Location({
		_id: new mongoose.Types.ObjectId(),
		latitude: request.body.latitude,
		longitude: request.body.longitude,
		userID: request.body.userID,
		title: request.body.title,
		address: request.body.address,
		description: request.body.description,
		price: request.body.price,
		phone: request.body.phone,
		images: request.body.images
	})

	location.save().then((location) => {
		response.send(location)
	}, (error) => {
		response.status(400).send(error)
	})
})

router.get(Route.default, authenticateAsClient, (request, response) => {
	Location.find({}).then((locations) => {
		response.send({ locations })
	}, (error) => {
		response.status(400).send(error)
	})
})

module.exports = router
