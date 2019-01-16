let { User } = require('./../models/user')
let { Header } = require('./../utils/constants')

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

module.exports = {
	authenticateAsClient,
}
