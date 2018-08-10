let express = require('express')
let mongoose = require('mongoose')
let { authenticateAsClient } = require('./../middleware/authenticate')
let { Question } = require('../models/question')

let router = express.Router()

let Route = {
    default: '/',
    randomQuestion: '/random'
}

// TODO - only done by admin
router.post(Route.default, (request, response) => {
    let question = new Question({
        _id: new mongoose.Types.ObjectId(),
        question: request.body.question,
        answer: request.body.answer
    })

    question.save().then((question) => {
        response.send(question)
    }, (error) => {
        response.status(400).send(error)
    })
})

router.get(Route.randomQuestion, authenticateAsClient, (request, response) => {
    Question.find({}).then((questions) => {
        if (questions.length === 0) {
            response.status(400).send()
        }
        let randomIndex = Math.floor((Math.random() * questions.length))
        let question = questions[randomIndex]
        response.send({ question })
    }, (error) => {
        response.status(400).send(error)
    })
})

module.exports = router