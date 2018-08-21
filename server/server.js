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
let questionRoutes = require('./routes/questions')

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
app.use(APIRoute.questions, questionRoutes)

var typingUsers = {}

io.on(SocketEvent.connection, (socket) => {
	console.log('A new user has connected!')

	socket.on(SocketEvent.newChannel, function (name, description) {
		let channel = new Channel({
			name,
			description,
		})
		channel.save(function (error, channel) {
			io.emit(SocketEvent.channelCreated, channel.id, channel.name, channel.description)
		})
	})

	socket.on(SocketEvent.startType, function (username, channelID) {
		typingUsers[username] = channelID
		io.emit(SocketEvent.userTypingUpdate, channelID, typingUsers)
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
		
		message.save(function (error, message){
			io.emit(SocketEvent.messageCreated, message.id, message.userID, message.channelID, message.body,
				message.username, message.date)
		})
	})

	socket.on(SocketEvent.newLocation, function (latitude, longitude, userID, title, address, 
		description, price, images) {

		let location = new Location({
			latitude,
			longitude,
			userID,
			title,
			address,
			description,
			price,
			images
		})

		location.save(function (error, location) {
			io.emit(SocketEvent.locationCreated, location._id, location.userID, location.latitude, 
				location.longitude, location.title, location.address, 
				location.description, location.price, location.images)
		})
	})

	socket.on(SocketEvent.deleteLocation, function (id) {
		Location.findOneAndRemove({ _id: id}, (error, location) => {
			io.emit(SocketEvent.locationDeleted, location._id, location.userID, 
				location.latitude, location.longitude, location.title, location.address, 
				location.description, location.images)
		})
	})

	socket.on(SocketEvent.updateLocation, function (id, latitude, longitude, userID, title, address, 
		description, price, images) {
		let body = {
			id,
			latitude,
			longitude,
			userID,
			title,
			address,
			description,
			price,
			images
		}

		Location.findOneAndUpdate({ _id: id }, { $set: body }, { new: true }, (error, location, response) => {
			io.emit(SocketEvent.locationUpdated, location._id, location.userID, location.latitude, location.longitude,
			location.title, location.address, location.description, location.price, location.images)
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
