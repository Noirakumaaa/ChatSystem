const Conversation = require('../model/Conversation.model');
const Message = require('../model/Message.model')


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


async function getConversation(data) {
    console.log("Get Conversation : ", data)

    const conversation = await Conversation.findOne({
        participants: { $all: [data.sender, data.receiver] },
        $expr: { $eq: [{ $size: "$participants" }, 2] } // ✅ Ensures only 2 participants
      }).select("_id"); // ✅ Only fetches the conversation ID


      console.log("CONVERSATIONN : " ,conversation)

    if(!conversation){
        const createConver = await Conversation.create({
            participants: [data.sender, data.receiver]
        });
    
        const Messages = await Message.find({
            conversationID: createConver._id
        }).populate("sender", "username") 
        .sort({ createdAt: 1 }); 

        console.log(Messages)

        return Messages
        
    }

    const Messages = await Message.find({
        conversationID: conversation._id
    }).populate("sender", "username") 
    .sort({ createdAt: 1 }); 
    console.log(Messages)
    return Messages
}


module.exports = {
    sendMessage,
    getMessages,
    getConversation
}