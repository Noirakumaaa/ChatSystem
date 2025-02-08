const mongoose = require('mongoose');


const MessageSchema = new mongoose.Schema({
    conversationID: {
        type :mongoose.Schema.Types.ObjectId, 
        ref: "Conversation", 
        required: true
    },
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


module.exports = mongoose.model('Messages', MessageSchema);