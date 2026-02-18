const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        trim: true
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);