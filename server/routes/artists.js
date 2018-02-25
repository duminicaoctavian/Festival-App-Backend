const express = require('express')
const mongoose = require('mongoose')
const Artist = require('../models/artist.js')
const router = express.Router()

router.post('/', (req, res) => {
  var artist = new Artist({
    _id: new mongoose.Types.ObjectId(),
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

router.get('/', (req, res) => {
  Artist.find({}).sort('name').then((artists) => {
    res.send({artists})
  }, (e) => {
    res.status(400).send(e)
  })
})

router.get('/:stage', (req, res) => {
  var stage = req.params.stage

  Artist.find({
    stage: stage,
  }).sort('name').then((artists) => {
    if (artists.length === 0) {
      return res.status(404).send()
    }
    res.send({artists})
  }).catch((e) => {
    res.status(400).send()
  })
})

module.exports = router
