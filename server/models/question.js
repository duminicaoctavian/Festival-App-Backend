let mongoose = require('mongoose')
let { ModelName } = require('./../utils/constants')

let QuestionSchema = mongoose.Schema({
    question: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true
    },
    answer: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
})

let Question = mongoose.model(ModelName.question, QuestionSchema)

module.exports = {
    Question
}