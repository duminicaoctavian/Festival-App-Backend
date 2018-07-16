let express = require('express')
var { mongoose } = require('./../db/mongoose')
var { User } = require('../models/user.js')
let router = express.Router()
let _ = require('lodash')
let bodyParser = require('body-parser')
var { authenticate } = require('./../middleware/authenticate.js')
let { ObjectID } = require('mongodb')
let bcrypt = require('bcryptjs')

router.post('/', async (req, res) => {
	try {
		var body = {
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			imageUrl: 'https://firebasestorage.googleapis.com/v0/b/granis-fbe83.appspot.com/o/ProfileImages%2Fprofile-default.jpg?alt=media&token=9d9d275b-710b-4637-ae95-5944a5fb2948'
		}
		let user = new User(body)
		await user.save()
		let token = await user.generateAuthToken()
		res.header('X-Auth', token).send(user)
	} catch (e) {
		res.status(400).send(e)
	}
})

router.get('/me', authenticate, (req, res) => {
	res.send(req.user)
})

router.post('/login', async (req, res) => {
	try {
		let body = _.pick(req.body, ['username', 'email', 'password'])
		let user = await User.findByCredentials(body.email, body.password)
		let token = await user.generateAuthToken()
		res.header('X-Auth', token).send(user)
	} catch (e) {
		res.status(400).send()
	}
})

router.delete('/me/token', authenticate, async (req, res) => {
	try {
		let message = {
			message: "Succesfully logged out user"
		}
		await req.user.removeToken(req.token)
		res.status(200).send(message)
	} catch (e) {
		res.status(400).send()
	}
})

router.get('/:id', (req, res) => {
	User
		.findOne({ '_id': req.params.id })
		.exec((err, userData) => {
			if (err) {
				res.status(500).json({ message: err });
			}
			res.status(200).json(userData);
		})
})

router.get('/:email', (req, res) => {
	User
		.findOne({ 'email': req.params.email })
		.exec((err, userData) => {
			if (err) {
				res.status(500).json({ message: err });
			}
			res.status(200).json(userData);
		})
})

router.patch('/:id', (req, res) => {
	var id = req.params.id

	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	var username = req.body.username
	var password = req.body.password
	var imageUrl = req.body.imageUrl
	console.log(password)

	if (password === undefined || password === "") {
		console.log("HERE")
		var body = {
			username: username,
			imageUrl: imageUrl
		}

		User.findOneAndUpdate({ _id: id }, { $set: body }, { new: true }).then((user) => {
			if (!user) {
				return res.status(404).send()
			}

			res.send(user)
		}).catch((e) => {
			res.status(400).send()
		})

	} else {

		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(password, salt, (err, hash) => {
				password = hash

				var body = {
					username: username,
					password: password,
					imageUrl: imageUrl
				}

				User.findOneAndUpdate({ _id: id }, { $set: body }, { new: true }).then((user) => {
					if (!user) {
						return res.status(404).send()
					}

					res.send(user)
				}).catch((e) => {
					res.status(400).send()
				})
			})
		})
	}
})

module.exports = router
