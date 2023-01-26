const Delivery = require('../models/Delivery')

const addDeliveryOption = async (req, res) => {
    const { method, price } = req.body

    try {
        const delivery = new Delivery({ method, price })
        await delivery.save()
        res.json({ deliveryOption: delivery })
    } catch {
        res.status(400).json({ msg: 'Failed to add a Delivery Option' })
    }
}

const getAllDeliveryOptions = async (req, res) => {
    const data = await Delivery.find({})
    res.json({ deliveryOptions: data })
}

const deleteDeliveryOption = async (req, res) => {
    const deliveryId = req.params.deliveryId

    try {
        await Delivery.findByIdAndDelete(deliveryId)
        res.json({ deliveryId: deliveryId })
    } catch {
        res.status(400).json({ msg: 'Failed to delete the Delivery Option' })
    }
}

module.exports = { addDeliveryOption, getAllDeliveryOptions, deleteDeliveryOption }
