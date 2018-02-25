require('./config/config.js')

const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const productRoutes = require('./routes/products.js')
const artistRoutes = require('./routes/artists.js')
const usersRoutes = require('./routes/users.js')
const port = process.env.PORT

var {mongoose} = require('./db/mongoose')
var {Artist} = require('./models/artist.js')
var {Product} = require('./models/product.js')
var {User} = require('./models/user.js')

var app = express()

app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))
app.use('/products', productRoutes)
app.use('/artists', artistRoutes)
app.use('/users', usersRoutes)

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})

module.exports = {
  app
}
