const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    productId: {
        type: mongoose.ObjectId,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Comment', commentSchema)