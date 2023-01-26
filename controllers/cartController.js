const mongoose = require('mongoose')
const Cart = require('../models/Cart')


const addProductToCart = async (req, res) => {
    const { quantity, userToken } = req.body

    if (!req.body.productId) return res.status(400).json({ msg: 'Invalid input' })

    try {
        const productId = mongoose.Types.ObjectId(req.body.productId)
        const cart = await Cart.find({ productId, userToken })

        if (cart.length === 0) {
            const newCart = new Cart({ productId, quantity, userToken })
            await newCart.save()
        }
        else {
            const newQuantity = cart[0].quantity + quantity
            await Cart.updateOne({ _id: cart[0]._id }, { quantity: newQuantity })
        }

        const response = await Cart.aggregate([
            {
                $match: { userToken: userToken }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $unwind: '$product'
            },
            {
                $match: { 'product._id': productId }
            },
            {
                $project: {
                    _id: 1,
                    quantity: 1,
                    product: {
                        _id: 1,
                        title: 1,
                        picture: 1,
                        price: 1,
                        quantity: 1,
                    }
                }
            }
        ])

        res.json({ cart: response[0] })
    } catch {
        res.status(400).json({ msg: 'Failed to add a Product' })
    }
}

const getCart = async (req, res) => {
    const userToken = req.params.userToken

    const response = await Cart.aggregate([
        {
            $match: { userToken: userToken }
        },
        {
            $lookup: {
                from: 'products',
                localField: 'productId',
                foreignField: '_id',
                as: 'product'
            }
        },
        {
            $unwind: '$product'
        },
        {
            $project: {
                _id: 1,
                quantity: 1,
                product: {
                    _id: 1,
                    title: 1,
                    picture: 1,
                    price: 1,
                    quantity: 1,
                }
            }
        }
    ])
    res.json({ cart: response })
}

const deleteProductFromCart = async (req, res) => {
    const cartId = req.params.cartId

    try {
        await Cart.deleteOne({ _id: cartId })
        res.json({ cartId: cartId })
    } catch {
        res.status(400).json({ msg: 'Failed to delete the Product' })
    }
}

const updateProductFromCart = async (req, res) => {
    const { quantity } = req.body
    const cartId = req.params.cartId

    if (!quantity) return res.status(400).json({ msg: 'Invalid input' })

    try {
        await Cart.updateOne({ _id: cartId }, { quantity: quantity })
        res.json({ cartId, quantity })
    } catch {
        res.status(400).json({ msg: 'Failed to update the Product' })
    }
}

const clearCart = async (req, res) => {
    const userToken = req.params.userToken

    const response = await Cart.deleteMany({ userToken: userToken })
    res.json({ response })
}

const handleCheckout = async (req, res) => {
    const { delivery, email, address1, address2, city, zip } = req.body

    let valid = true

    if (!delivery || !email || !address1 || !city || !zip) valid = false
    if (typeof delivery !== 'string') valid = false
    if (typeof email !== 'string') valid = false
    if (typeof address1 !== 'string') valid = false
    if (typeof address2 !== 'string') valid = false
    if (typeof city !== 'string') valid = false
    if (typeof zip !== 'string') valid = false

    const emailTemplate = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailTemplate.test(email)) valid = false
    if (!valid) return res.status(400).json({ msg: 'Invalid data' })

    res.json({ msg: 'ok' })
}

const handleConfirm = async (req, res) => {
    res.json({ msg: 'ok' })
}

module.exports = { addProductToCart, getCart, deleteProductFromCart, updateProductFromCart, clearCart, handleCheckout, handleConfirm }