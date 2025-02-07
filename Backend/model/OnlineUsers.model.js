const mongoose = require('mongoose');

const onlineUserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    socketId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "offline"
    },
    Timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('OnlineUsers', onlineUserSchema);
