const mongoose = require('mongoose')

const deliverySchema = new mongoose.Schema({
    method: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Delivery', deliverySchema)