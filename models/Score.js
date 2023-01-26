const mongoose = require('mongoose')

const scoreSchema = new mongoose.Schema({
    productId: {
        type: mongoose.ObjectId,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Score', scoreSchema)