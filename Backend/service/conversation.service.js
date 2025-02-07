const Conversation = require('../model/Conversation.model');


async function sendMessage(data){
    const {sender, receiver, message} = data;
    try{
        const newMessage = await Conversation.create({
            sender,
            receiver,
            message
        });
        return {success: true, data: newMessage};
    }catch(error){
        return {success: false, error};
    }
}


async function getMessages(data){
    const conversationId = data;
    try{
        const messages = await Conversation.find({conversationId}).limit(20).sort({time: -1});
        return {success: true, data: messages};
    }catch(error){
        return {success: false, error}; 

    }

}


module.exports = {
    sendMessage,
    getMessages
}