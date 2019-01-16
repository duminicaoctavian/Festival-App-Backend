//./mongod --dbpath ~/mongo-data

let config = require('./config/config')
let _ = require('lodash')
let express = require('express')
let bodyParser = require('body-parser')
let http = require('http')
let { APIRoute } = require('./utils/constants')
var { sendNotification } = require('./utils/apns')

let offerRoutes = require('./routes/offers')
let usersRoutes = require('./routes/users')
let applicationRoutes = require('./routes/applications')

let port = process.env.PORT

let Log = {
	serverStart: `Server started on port ${port}`,
	userConnection: 'A new user has connected',
}

var app = express()
var server = http.createServer(app)

app.use(bodyParser.json())
app.use(APIRoute.users, usersRoutes)
app.use(APIRoute.offers, offerRoutes)
app.use(APIRoute.applications, applicationRoutes)

server.listen(port, () => {
	console.log(Log.serverStart)
})

module.exports = {
	app
}
