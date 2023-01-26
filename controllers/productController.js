const Product = require('../models/Product.js')
const Delivery = require('../models/Delivery.js')

const getAllProducts = async (req, res) => {
    const delivery = await Delivery.find({})
    const deliveryPrice = delivery.length ? delivery[0].price : 0
    const data = await Product.find({})
    const response = data.map(product => {
        return {
            _id: product._id,
            title: product.title,
            picture: product.picture,
            price: product.price,
            priceWithDelivery: product.price + deliveryPrice,
            quantity: product.quantity,
            shortDescription: product.shortDescription,
        }
    })
    res.json({ products: response })
}

const addProduct = async (req, res) => {
    const { title, picture, price, quantity, type, shortDescription, longDescription } = req.body

    const delivery = await Delivery.find({})
    const deliveryPrice = delivery.length ? delivery[0].price : 0

    try {
        const product = new Product({ title, picture, price, quantity, type, shortDescription, longDescription })
        await product.save()
        const response = {
            _id: product._id,
            title: product.title,
            picture: product.picture,
            price: product.price,
            priceWithDelivery: product.price + deliveryPrice,
            quantity: product.quantity,
            shortDescription: product.shortDescription,
        }
        res.json({ product: response })
    } catch {
        return res.status(400).json({ msg: "Failed to add a Product" })
    }
}

const getProduct = async (req, res) => {
    const productId = req.params.productId

    try {
        const product = await Product.findById(productId)
        res.json({ product })
    } catch {
        return res.status(400).json({ msg: "Failed to get the Product" })
    }
}

const updateProduct = async (req, res) => {
    const productId = req.params.productId
    const { title, picture, price, quantity, type, shortDescription, longDescription } = req.body

    const delivery = await Delivery.find({})
    const deliveryPrice = delivery.length ? delivery[0].price : 0

    try {
        await Product.updateOne({ _id: productId }, { title, picture, price, quantity, type, shortDescription, longDescription })
        const product = await Product.findOne({ _id: productId })
        const response = {
            _id: product._id,
            title: product.title,
            picture: product.picture,
            price: product.price,
            priceWithDelivery: product.price + deliveryPrice,
            quantity: product.quantity,
            shortDescription: product.shortDescription,
        }
        res.json({ product: response })
    } catch {
        return res.status(400).json({ msg: "Failed to update the Product" })
    }
}

const deleteProduct = async (req, res) => {
    const productId = req.params.productId

    try {
        await Product.findByIdAndDelete(productId)
        res.json({ productId })
    } catch {
        return res.status(400).json({ msg: "Failed to delete the Product" })
    }
}

const getProductsByParams = async (req, res) => {
    const { order, minPrice, maxPrice, type } = req.body
    if (!order || !type) return res.status(400).json({ msg: 'Invalid input' })

    const orderDict = {
        'oldest': { date: 1 },
        'newest': { date: -1 },
        'score': { avgScore: -1 },
        'highPrice': { price: -1 },
        'lowPrice': { price: 1 },
        'alphabetical': { title: 1 },
    }

    if (!orderDict[order]) return res.status(400).json({ msg: 'Invalid input' })

    let filters = {}
    if (minPrice || maxPrice) filters.price = {}
    if (minPrice) filters.price.$gte = minPrice
    if (maxPrice) filters.price.$lte = maxPrice
    if (type !== 'all') filters.type = type

    const delivery = await Delivery.find({})
    const deliveryPrice = delivery.length ? delivery[0].price : 0

    const data = await Product.aggregate([
        {
            $lookup: {
                from: "scores",
                localField: "_id",
                foreignField: "productId",
                as: "scores"
            }
        },
        {
            $project: {
                _id: 1,
                title: 1,
                picture: 1,
                price: 1,
                quantity: 1,
                shortDescription: 1,
                type: 1,
                date: 1,
                avgScore: { $avg: "$scores.score" },
            }
        },
        {
            $match: filters
        },
        {
            $sort: orderDict[order]
        },
        {
            $project: {
                type: 0,
                date: 0,
                avgScore: 0,
            }
        }
    ])

    const result = data.map(product => {
        product.priceWithDelivery = product.price + deliveryPrice
        return product
    })

    res.json({ products: result })
}

module.exports = { getAllProducts, addProduct, getProductsByParams, getProduct, updateProduct, deleteProduct }