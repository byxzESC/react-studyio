const { Schema } = require("mongoose");
const dateFormat = require('../utils/dateFormat')
const mongoose = require('mongoose')


const cardSchema = new Schema({
    deckId: {
        type: String,
        required: false
    },
    question: {
        type: String,
        require: true,
        maxLength: 255
    },
    answer: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => dateFormat(timestamp),
    },
})

// create an instance of Card schema
const Card = mongoose.model('Card', cardSchema);

module.exports = Card;