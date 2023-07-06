require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const PORT = process.env.PORT || 3500
const app = express()

app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://verglass.github.io']
}))

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) return res.status(400).send({ status: 404, message: err.message })
    next()
})

mongoose.connect(process.env.DATABASE_URI)

const productController = require('./controllers/productController')
const deliveryController = require('./controllers/deliveryController')
const scoreController = require('./controllers/scoreController')
const commentController = require('./controllers/commentController')
const cartController = require('./controllers/cartController')

app.get('/products', productController.getAllProducts)
app.post('/products', productController.addProduct)
app.get('/products/:productId', productController.getProduct)
app.put('/products/:productId', productController.updateProduct)
app.delete('/products/:productId', productController.deleteProduct)
app.post('/products/filter', productController.getProductsByParams)

app.post('/score', scoreController.addScore)
app.get('/score/:productId', scoreController.getScores)
app.get('/score/:productId/avg', scoreController.getAvgScore)
app.delete('/score/:scoreId', scoreController.deleteScore)

app.post('/comment', commentController.addComment)
app.get('/comment/:productId', commentController.getComments)
app.delete('/comment/:commentId', commentController.deleteComment)
app.post('/comment/:productId', commentController.fetchCommentsByParams)

app.get('/delivery', deliveryController.getAllDeliveryOptions)
app.post('/delivery', deliveryController.addDeliveryOption)
app.delete('/delivery/:deliveryId', deliveryController.deleteDeliveryOption)

app.get('/cart/:userToken', cartController.getCart)
app.post('/cart', cartController.addProductToCart)
app.delete('/cart/:cartId', cartController.deleteProductFromCart)
app.put('/cart/:cartId', cartController.updateProductFromCart)
app.delete('/cart/clear/:userToken', cartController.clearCart)
app.post('/cart/checkout', cartController.handleCheckout)
app.post('/cart/checkout/confirm', cartController.handleConfirm)

app.listen(PORT, () => { console.log(`Listening on port ${PORT}`) })
