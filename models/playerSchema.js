const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
    //User ID
    _id: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    steamId: {
        type: String,
    },
    pubgId: {
        type: String,
    },
    createAt: {
        type: Date,
        required: true,
        immutable: true,
        default: () => Date.now(),
    },
    updatedAt: {
        type: Date,
        required: true,
        default: () => Date.now(),
    }
})
module.exports = mongoose.model('player', playerSchema);