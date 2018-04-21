require('./config/config.js')

//./mongod --dbpath ~/mongo-data

const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const socketIO = require('socket.io')
const http = require('http')
const productRoutes = require('./routes/products.js')
const artistRoutes = require('./routes/artists.js')
const usersRoutes = require('./routes/users.js')
const channelsRoutes = require('./routes/channels.js')
const messagesRoutes = require('./routes/messages.js')
const locationRoutes = require('./routes/locations.js')
const newsRoutes = require('./routes/news.js')
const Message = require('./models/message.js')
const port = process.env.PORT

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
  socket.on('newChannel', function(name, description) {
    //Create channel
    let newChannel = new Channel ({
      name: name,
      description: description,
    })
    //Save it to database
    newChannel.save(function(err, channel){
      //Send message to those connected in the room
      console.log('new channel created')
      io.emit("channelCreated", channel.name, channel.description, channel.id)
    })
  })

  //Listens for user typing.
  socket.on("startType", function(userName, channelId){
    console.log("User " + userName + " is writing a message...")
    typingUsers[userName] = channelId
    io.emit("userTypingUpdate", typingUsers, channelId)
  })

  socket.on("stopType", function(userName){
    console.log("User " + userName + " has stopped writing a message...")
    delete typingUsers[userName]
    io.emit("userTypingUpdate", typingUsers)
  })

  //Listens for a new chat message
  socket.on('newMessage', function(messageBody, userId, channelId, userName) {
    //Create message

    console.log(messageBody)

    let newMessage = new Message({
      messageBody: messageBody,
      userId: userId,
      channelId: channelId,
      userName: userName,
    })
    //Save it to database
    newMessage.save(function(err, msg){
      //Send message to those connected in the room
      console.log('new message sent')

      io.emit("messageCreated",  msg.messageBody, msg.userId, msg.channelId, msg.userName, msg.id, msg.timeStamp);
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
