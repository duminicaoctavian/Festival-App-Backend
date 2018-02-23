require('./config/config.js')

const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')

var {mongoose} = require('./db/mongoose')
var {Artist} = require('./models/artist.js')

var app = express()
const port = process.env.PORT

app.use(bodyParser.json())

app.post('/artists', (req, res) => {
  var artist = new Artist({
    name: req.body.name,
    genre: req.body.genre,
    description: req.body.description,
    stage: req.body.stage
  })

  artist.save().then((doc) => {
    res.send(doc)
  }, (err) => {
    res.status(400).send(err)
  })
})

app.get('/artists', (req, res) => {
  Artist.find({}).sort('name').then((artists) => {
    res.send({artists})
  }, (e) => {
    res.status(400).send(e)
  })
})

app.get('/artists/:stage', (req, res) => {
  var stage = req.params.stage

  Artist.find({
    stage: stage,
  }).then((artists) => {
    if (artists.length === 0) {
      return res.status(404).send()
    }
    res.send({artists})
  }).catch((e) => {
    res.status(400).send()
  })
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})

module.exports = {
  app
}
