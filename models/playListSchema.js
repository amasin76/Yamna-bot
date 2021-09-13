const mongoose = require('mongoose')

const playListSchema = new mongoose.Schema({
    //User ID
    _id: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    playlist: {
        type: [String],
        required: true
    }
})
module.exports = mongoose.model('playlist', playListSchema)