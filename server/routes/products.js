let express = require('express')
let mongoose = require('mongoose')
let { Product } = require('../models/product')
let { authenticateAsClient } = require('./../middleware/authenticate')

let router = express.Router()

let Route = {
	default: '/',
	byCategory: '/:category'
}

router.get(Route.default, authenticateAsClient, (request, response, next) => {
	Product.find({}).then(products => {
		let res = {
			count: products.length,
			products: products.map(product => {
				return {
					_id: product._id,
					name: product.name,
					price: product.price,
					images: product.images,
					category: product.category
				}
			})
		}
		response.status(200).json(res);
	}).catch(error => {
		response.status(500).json({
			error
		})
	})
})

// TODO - operation only done by admin
router.post(Route.default, (request, response, next) => {
	let product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: request.body.name,
		price: request.body.price,
		images: request.body.images,
		category: request.body.category
	})

	product.save().then(product => {
		response.status(201).json({
			createdProduct: {
				_id: product._id,
				name: product.name,
				price: product.price,
				category: product.category,
				images: product.images
			}
		})
	}).catch(error => {
		res.status(500).json({
			error
		})
	})
})

router.get(Route.byCategory, authenticateAsClient, (request, response) => {
	let category = request.params.category

	Product.find({ category }).sort('name').then((products) => {
		if (products.length === 0) {
			return response.status(404).send()
		}
		response.send({ products })
	}).catch((error) => {
		response.status(400).send()
	})
})

module.exports = router
