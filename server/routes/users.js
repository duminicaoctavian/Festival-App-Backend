const express = require('express')
var {mongoose} = require('./../db/mongoose')
var {User} = require('../models/user.js')
const router = express.Router()
const _ = require('lodash')
const bodyParser = require('body-parser')
var {authenticate} = require('./../middleware/authenticate.js')

router.post('/', async (req, res) => {
  try{
    const body = _.pick(req.body, ['email', 'password'])
    const user = new User(body)
    await user.save()
    const token = await user.generateAuthToken()
    res.header('x-auth', token).send(user)
  } catch(e) {
    res.status(400).send(e)
  }
})

router.get('/me', authenticate, (req, res) => {
  res.send(req.user)
})

router.post('/login', async (req, res) => {
  try{
    const body = _.pick(req.body, ['email', 'password'])
    const user = await User.findByCredentials(body.email, body.password)
    const token = await user.generateAuthToken()
    res.header('x-auth', token).send(user)
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

module.exports = router
