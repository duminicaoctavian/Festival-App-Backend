let express = require('express')
let mongoose = require('mongoose')
let { News } = require('../models/news')
let { authenticateAsClient } = require('./../middleware/authenticate')

let router = express.Router()

let Route = {
	default: '/'
}

// TODO - only done by admin
router.post(Route.default, (request, response) => {
	var news = new News({
		_id: new mongoose.Types.ObjectId(),
		title: request.body.title,
		description: request.body.description,
		videoURL: request.body.videoURL,
		imageURL: request.body.imageURL
	})

	news.save().then((news) => {
		response.send(news)
	}, (error) => {
		response.status(400).send(error)
	})
})

router.get(Route.default, authenticateAsClient, (request, response) => {
	News.find({}).sort([['date', 'descending']]).then((news) => {
		response.send({ news })
	}, (error) => {
		response.status(400).send(error)
	})
})

module.exports = router
