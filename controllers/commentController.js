const mongoose = require('mongoose')
const Comment = require('../models/Comment')

const addComment = async (req, res) => {
    const { comment } = req.body
    if (!req.body.productId) return res.status(400).json({ msg: 'Invalid input' })

    try {
        const productId = mongoose.Types.ObjectId(req.body.productId)
        const newComment = new Comment({ productId, comment })
        await newComment.save()
        res.json({ comment: newComment })
    } catch {
        res.status(400).json({ msg: 'Failed to add a Comment' })
    }
}

const getComments = async (req, res) => {
    try {
        const productId = mongoose.Types.ObjectId(req.params.productId)
        const response = await Comment.find({ productId })
    
        res.json({ comments: response })
    } catch {
        res.status(400).json({ msg: 'Failed to get the Comments' })
    }
}

const fetchCommentsByParams = async (req, res) => {
    const { order, minDate, maxDate, template } = req.body
    let productId  = req.params.productId
    if (!order || !productId) return res.status(400).json({ msg: 'Invalid input' })

    try {
        productId = mongoose.Types.ObjectId(productId)
    } catch {
        return res.status(400).json({ msg: 'Invalid input' })
    }

    const orderDict = {
        'oldest': { date: 1 },
        'newest': { date: -1 },
        'alphabetical': { comment: 1 },
    }

    if (!orderDict[order]) return res.status(400).json({ msg: 'Invalid input' })

    let filters = {}
    if (minDate || maxDate) filters.date = {}
    if (template) filters.comment = { $regex: template, $options: 'i' }
    if (minDate) filters.date.$gte = new Date(minDate)
    if (maxDate) filters.date.$lte = new Date(maxDate)

    const response = await Comment.aggregate([
        { $match: { productId: productId } },
        { $sort: orderDict[order] },
        { $match: filters }
    ])

    res.json({ comments: response })
}

const deleteComment = async (req, res) => {
    const commentId = req.params.commentId

    try {
        const comment = await Comment.findById(commentId)
        await Comment.deleteOne({ _id: commentId })
        res.json({ commentId: commentId, productId: comment.productId })
    } catch {
        res.status(400).json({ msg: 'Failed to delete the Comment' })
    }
}

module.exports = { addComment, getComments, fetchCommentsByParams, deleteComment }
