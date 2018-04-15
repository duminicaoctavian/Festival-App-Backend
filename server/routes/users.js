const express = require('express')
var {mongoose} = require('./../db/mongoose')
var {User} = require('../models/user.js')
const router = express.Router()
const _ = require('lodash')
const bodyParser = require('body-parser')
var {authenticate} = require('./../middleware/authenticate.js')
const {ObjectID} = require('mongodb')
const bcrypt = require('bcryptjs')

router.post('/', async (req, res) => {
  try{
    const body = _.pick(req.body, ['username', 'email', 'password'])
    const user = new User(body)
    await user.save()
    const token = await user.generateAuthToken()
    res.header('X-Auth', token).send(user)
  } catch(e) {
    res.status(400).send(e)
  }
})

router.get('/me', authenticate, (req, res) => {
  res.send(req.user)
})

router.post('/login', async (req, res) => {
  try{
    const body = _.pick(req.body, ['username', 'email', 'password'])
    const user = await User.findByCredentials(body.email, body.password)
    const token = await user.generateAuthToken()
    res.header('X-Auth', token).send(user)
  } catch (e) {
    res.status(400).send()
  }
})

router.delete('/me/token', authenticate, async (req, res) => {
  try {
    const message = {
      message: "Succesfully logged out user"
    }
    await req.user.removeToken(req.token)
    res.status(200).send(message)
  } catch (e) {
    res.status(400).send()
  }
})

router.get('/:email', (req, res) => {
  User
    .findOne({ 'email': req.params.email })
    .exec((err, userData) => {
      if (err) {
        res.status(500).json({ message: err });
      }
      res.status(200).json(userData);
    })
})

router.patch('/:id', (req, res) => {
  var id = req.params.id

  if(!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  var username = req.body.username
  var password = req.body.password
  console.log(password)

  if (password === undefined || password === "") {
    console.log("HERE")
    var body = {
      username : username
    }

    User.findOneAndUpdate({_id: id}, {$set: body}, {new: true}).then((user) => {
      if(!user) {
        return res.status(404).send()
      }

      res.send(user)
    }).catch((e) => {
      res.status(400).send()
    })

  } else {

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          password = hash

          var body = {
            username : username,
            password : password
          }

          User.findOneAndUpdate({_id: id}, {$set: body}, {new: true}).then((user) => {
            if(!user) {
              return res.status(404).send()
            }

            res.send(user)
          }).catch((e) => {
            res.status(400).send()
          })
        })
    })
  }
})

module.exports = router
