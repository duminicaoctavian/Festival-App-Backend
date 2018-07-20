//./mongod --dbpath ~/mongo-data

let config = require('./config/config')
let _ = require('lodash')
let express = require('express')
let bodyParser = require('body-parser')
let socketIO = require('socket.io')
let http = require('http')
let { APIRoute, SocketEvent } = require('./utils/constants')

let productRoutes = require('./routes/products')
let artistRoutes = require('./routes/artists')
let usersRoutes = require('./routes/users')
let channelsRoutes = require('./routes/channels')
let messagesRoutes = require('./routes/messages')
let locationRoutes = require('./routes/locations')
let newsRoutes = require('./routes/news')

let { Message } = require('./models/message')
let { Location } = require('./models/location')

let port = process.env.PORT

let Log = {
	serverStart: `Server started on port ${port}`
}

var app = express()
var server = http.createServer(app)
let io = socketIO(server)

app.use(bodyParser.json())
app.use(APIRoute.products, productRoutes)
app.use(APIRoute.artists, artistRoutes)
app.use(APIRoute.users, usersRoutes)
app.use(APIRoute.channels, channelsRoutes)
app.use(APIRoute.messages, messagesRoutes)
app.use(APIRoute.news, newsRoutes)
app.use(APIRoute.locations, locationRoutes)

var typingUsers = {}

io.on(SocketEvent.connection, (socket) => {
	console.log('A new user has connected!')
	socket.on(SocketEvent.newChannel, function (name, description) {
		let channel = new Channel({
			name,
			description,
		})
		channel.save(function (error, channel) {
			io.emit(SocketEvent.channelCreated, channel.name, channel.description, channel.id)
		})
	})

	socket.on(SocketEvent.startType, function (username, channelID) {
		typingUsers[username] = channelID
		io.emit(SocketEvent.userTypingUpdate, typingUsers, channelID)
	})

	socket.on(SocketEvent.stopType, function (username) {
		delete typingUsers[username]
		io.emit(SocketEvent.userTypingUpdate, typingUsers)
	})

	socket.on(SocketEvent.newMessage, function (body, userID, channelID, username) {
		let message = new Message({
			body,
			userID,
			channelID,
			username,
		})
		message.save(function (error, message) {
			io.emit(SocketEvent.messageCreated, message.body, message.userID, message.channelID, 
				message.username, message.id, message.date)
		})
	})

	socket.on(SocketEvent.newLocation, function (latitude, longitude, userID, title, address, description, images) {

		let location = new Location({
			latitude,
			longitude,
			userID,
			title,
			address,
			description,
			images
		})

		location.save(function (error, location) {
			io.emit(SocketEvent.locationCreated, location._id, location.latitude, location.longitude, 
				location.userID, location.title, location.address, location.description, location.images)
		})

	})
})

server.listen(port, () => {
	console.log(Log.serverStart)
})

module.exports = {
	app,
	io
}
