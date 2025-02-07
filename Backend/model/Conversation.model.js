const mongoose = require('mongoose');


const ConversationSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    message : {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Conversation', ConversationSchema);