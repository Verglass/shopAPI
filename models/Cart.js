const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    productId: {
        type: mongoose.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    userToken: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Cart', cartSchema)