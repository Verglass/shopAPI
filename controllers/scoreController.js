const mongoose = require('mongoose')
const Score = require('../models/Score')

const addScore = async (req, res) => {
    const { score } = req.body

    try {
        const productId = mongoose.Types.ObjectId(req.body.productId)
        const newScore = new Score({ productId, score })
        await newScore.save()
        res.json({ score: newScore })
    } catch {
        res.status(400).json({ msg: 'Failed to add a Score' })
    }
}

const getScores = async (req, res) => {
    try {
        const productId = mongoose.Types.ObjectId(req.params.productId)
        const response = await Score.find({ productId })
        res.json({ scores: response })
    } catch {
        res.status(400).json({ msg: 'Failed to get the Scores' })
    }
}

const getAvgScore = async (req, res) => {
    try {
        const productId = mongoose.Types.ObjectId(req.params.productId)
        const data = await Score.aggregate([
            {
                $match: { productId }
            },
            {
                $group: {
                    _id: null,
                    avgScore: { $avg: "$score" }
                }
            }
        ])
        if (data.length) res.json({ avgScore: data[0].avgScore })
        else res.json({ avgScore: 0 })
    } catch {
        res.status(400).json({ msg: 'Failed to get the avarege Score' })
    }
}

const deleteScore = async (req, res) => {
    const scoreId = req.params.scoreId

    try {
        const score = await Score.findById(scoreId)
        await Score.deleteOne({ _id: scoreId })
        res.json({ scoreId: scoreId, productId: score.productId })
    } catch {
        res.status(400).json({ msg: 'Failed to delete the Score' })
    }
}

module.exports = { addScore, getScores, getAvgScore, deleteScore }
