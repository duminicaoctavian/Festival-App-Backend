let express = require('express')
let _ = require('lodash')
let bcrypt = require('bcryptjs')

let { mongoose } = require('./../db/mongoose')
let { User } = require('../models/user.js')
let { authenticateAsClient } = require('./../middleware/authenticate')
let { ObjectID } = require('mongodb')
let { StoragePath, Header, UserSerializationKey } = require('./../utils/constants')

let Route = {
	default: '/',
	me: '/me',
	login: '/login',
	logout: '/me/token',
	byID: '/:id',
	byEmail: '/:email'
}

let router = express.Router()

router.post(Route.default, async (request, response) => {
	try {
		let body = {
			username: request.body.username,
			email: request.body.email,
			password: request.body.password,
			imageUrl: StoragePath.defaultProfilePictureURL
		}

		let user = new User(body)
		await user.save()

		let token = await user.generateAuthToken()
		response.header(Header.client, token).send(user)
	} catch (error) {
		response.status(400).send(error)
	}
})

router.get(Route.me, authenticateAsClient, (request, response) => {
	response.send(request.user)
})

router.post(Route.login, async (request, response) => {
	try {
		let body = _.pick(request.body, [
			UserSerializationKey.user,
			UserSerializationKey.email,
			UserSerializationKey.password
		])

		let user = await User.findByCredentials(body.email, body.password)
		let token = await user.generateAuthToken()
		response.header(Header.client, token).send(user)
	} catch (error) {
		response.status(400).send()
	}
})

router.delete(Route.logout, authenticateAsClient, async (request, response) => {
	try {
		await request.user.removeToken(request.token)
		response.status(200).send()
	} catch (error) {
		response.status(400).send()
	}
})

router.get(Route.byID, (request, response) => {
	User.findOne({ '_id': request.params.id }).exec((error, userData) => {
		if (error) {
			response.status(500).json({ message: error })
		}
		response.status(200).json(userData)
	})
})

router.get(Route.byEmail, (request, response) => {
	User.findOne({ 'email': request.params.email }).exec((error, userData) => {
		if (error) {
			response.status(500).json({ message: error })
		}
		response.status(200).json(userData)
	})
})

router.patch(Route.byID, (request, response) => {
	let id = request.params.id

	if (!ObjectID.isValid(id)) {
		return response.status(404).send()
	}

	let username = request.body.username
	let password = request.body.password
	let imageUrl = request.body.imageUrl

	if (password === undefined || password === "") {
		let body = {
			username,
			imageUrl
		}

		User.findOneAndUpdate({ _id: id }, { $set: body }, { new: true }).then((user) => {
			if (!user) {
				return response.status(404).send()
			}

			response.send(user)
		}).catch((error) => {
			res.status(400).send()
		})

	} else {

		bcrypt.genSalt(10, (error, salt) => {
			bcrypt.hash(password, salt, (error, hash) => {
				password = hash

				let body = {
					username,
					password,
					imageUrl
				}

				User.findOneAndUpdate({ _id: id }, { $set: body }, { new: true }).then((user) => {
					if (!user) {
						return response.status(404).send()
					}

					response.send(user)
				}).catch((error) => {
					response.status(400).send()
				})
			})
		})
	}
})

module.exports = router
