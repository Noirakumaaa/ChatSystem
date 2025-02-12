const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    socketId: {
        type: String,
    },
    status:  {
        type : String,
        default : "Offline"
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    Timestamp: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model("Users", userSchema);