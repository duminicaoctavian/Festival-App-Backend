require('./config/config.js')

//./mongod --dbpath ~/mongo-data

let _ = require('lodash')
let express = require('express')
let bodyParser = require('body-parser')
let socketIO = require('socket.io')
let http = require('http')
let productRoutes = require('./routes/products.js')
let artistRoutes = require('./routes/artists.js')
let usersRoutes = require('./routes/users.js')
let channelsRoutes = require('./routes/channels.js')
let messagesRoutes = require('./routes/messages.js')
let locationRoutes = require('./routes/locations.js')
let newsRoutes = require('./routes/news.js')
let Message = require('./models/message.js')
let Location = require('./models/location.js')

let port = process.env.PORT

var app = express()
var server = http.createServer(app)
let io = socketIO(server)

app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))
app.use('/products', productRoutes)
app.use('/artists', artistRoutes)
app.use('/users', usersRoutes)
app.use('/channels', channelsRoutes)
app.use('/messages', messagesRoutes)
app.use('/news', newsRoutes)
app.use('/locations', locationRoutes)

var typingUsers = {};

app.get('/', (req, res) => {
	res.json({ message: 'API is alive!' })
});

io.on('connection', (socket) => {
	console.log('A user connected')
	//Listens for a new chat message
	socket.on('newChannel', function (name, description) {
		//Create channel
		let newChannel = new Channel({
			name: name,
			description: description,
		})
		//Save it to database
		newChannel.save(function (err, channel) {
			//Send message to those connected in the room
			console.log('new channel created')
			io.emit("channelCreated", channel.name, channel.description, channel.id)
		})
	})

	//Listens for user typing.
	socket.on("startType", function (username, channelID) {
		console.log("User " + username + " is writing a message...")
		typingUsers[username] = channelID
		io.emit("userTypingUpdate", typingUsers, channelID)
	})

	socket.on("stopType", function (username) {
		console.log("User " + username + " has stopped writing a message...")
		delete typingUsers[username]
		io.emit("userTypingUpdate", typingUsers)
	})

	//Listens for a new chat message
	socket.on('newMessage', function (body, userID, channelID, username) {
		//Create message

		console.log(body)

		let newMessage = new Message({
			body: body,
			userID: userID,
			channelID: channelID,
			username: username,
		})
		//Save it to database
		newMessage.save(function (err, msg) {
			//Send message to those connected in the room
			console.log('new message sent')

			io.emit("messageCreated", msg.body, msg.userID, msg.channelID, msg.username, msg.id, msg.date)
		})
	})

	socket.on('newLocation', function (latitude, longitude, userId, title, address, description, images) {
		console.log(images)
		console.log(latitude)
		console.log(longitude)
		console.log(userId)
		console.log(title)
		console.log(address)
		console.log(description)

		let newLocation = new Location({
			latitude: latitude,
			longitude: longitude,
			userId: userId,
			title: title,
			address: address,
			description: description,
			images: images
		})

		newLocation.save(function (err, loc) {

			console.log(loc)

			console.log('new location sent')

			io.emit("locationCreated", loc._id, loc.latitude, loc.longitude, loc.userId, loc.title, loc.address, loc.description, loc.images)
		})

	})
})

server.listen(port, () => {
	console.log(`Server started on port ${port}`)
})

module.exports = {
	app,
	io
}
