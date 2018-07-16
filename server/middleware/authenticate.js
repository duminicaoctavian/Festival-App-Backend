var { User } = require('./../models/user.js')

var authenticate = async (req, res, next) => {
	var token = req.header('X-Auth')

	try {
		const user = await User.findByToken(token)
		req.user = user
		req.token = token
		next()
	} catch (e) {
		res.status(401).send()
	}
}

module.exports = { authenticate }
