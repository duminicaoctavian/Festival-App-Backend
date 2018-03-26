const express = require('express')
const mongoose = require('mongoose')
const News = require('../models/news.js')
const router = express.Router()

var {authenticate} = require('./../middleware/authenticate.js')

router.post('/', (req, res) => {
  var news = new News({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    description: req.body.description,
    url: req.body.url
  })

  news.save().then((doc) => {
    res.send(doc)
  }, (err) => {
    res.status(400).send(err)
  })
})

router.get('/', (req, res) => {
  News.find({}).sort([['timeStamp','descending']]).then((news) => {
    res.send({news})
  }, (e) => {
    res.status(400).send(e)
  })
})

module.exports = router
