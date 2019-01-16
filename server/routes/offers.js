let express = require('express')
let mongoose = require('mongoose')
let { authenticateAsClient } = require('./../middleware/authenticate')
let { Offer } = require('../models/offer')

let router = express.Router()

let Route = {
	default: '/',
    userID: '/:id',
}

router.post(Route.default, authenticateAsClient, (request, response) => {

    let offer = new Offer({
        _id: new mongoose.Types.ObjectId(),
        userID: request.body.userID,
        title: request.body.title,
        description: request.body.description,
		phone: request.body.phone,
		companyImageURL: request.body.companyImageURL
    }) 

    offer.save().then((offer) => {
        response.send(offer)
    }, (error) => {
        response.status(400).send(error)
    })
})

router.get(Route.default, authenticateAsClient, (request, response) => {
	Offer.find({}).then((offers) => {
		response.send({ offers })
	}, (error) => {
		response.status(400).send(error)
	})
})

router.get(Route.userID, authenticateAsClient, (request, response) => {
	let id = request.params.id

	Offer.find({ userID: id }).sort({ datePosted: 'desc' }).then((offers) => {
		if (offers.length === 0) {
			return response.status(404).send()
		}
		response.send({ offers })
	}).catch((error) => {
		response.status(400).send(error)
	})
})

module.exports = router
