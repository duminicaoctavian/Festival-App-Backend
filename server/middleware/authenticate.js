let { User } = require('./../models/user')
let { Header } = require('./../utils/constants')

var authenticateAsAdmin = async (request, response, next) => {
	var token = request.header(Header.admin)

	try {
		let user = await User.findByToken(token)
		request.user = user
		request.token = token
		next()
	} catch (error) {
		response.status(401).send()
	}
}

var authenticateAsClient = async (request, response, next) => {
	var token = request.header(Header.client)

	try {
		let user = await User.findByToken(token)
		request.user = user
		request.token = token
		next()
	} catch (error) {
		response.status(401).send()
	}
}

var authenticateAsArtist = async (request, response, next) => {
	var token = request.header(Header.artist)

	try {
		let user = await User.findByToken(token)
		request.user = user
		request.token = token
		next()
	} catch (error) {
		response.status(401).send()
	}
}

var authenticateAsEmployee = async (request, response, next) => {
	var token = request.header(Header.employee)

	try {
		let user = await User.findByToken(token)
		request.user = user
		request.token = token
		next()
	} catch (error) {
		response.status(401).send()
	}
}

var authenticateAsOrganizer = async (request, response, next) => {
	var token = request.header(Header.organizer)

	try {
		let user = await User.findByToken(token)
		request.user = user
		request.token = token
		next()
	} catch (error) {
		response.status(401).send()
	}
}

module.exports = {
	authenticateAsAdmin, 
	authenticateAsClient,
	authenticateAsArtist,
	authenticateAsEmployee,
	authenticateAsOrganizer
}
