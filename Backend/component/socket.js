const OnlineUsers = require('../model/OnlineUsers.model');
const Users = require('../model/Users.model')
const Conversation = require('../model/Conversation.model')

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log("Socket ID : " , socket.id)


        
        socket.on('User', async (data) => {
            const userData = data.userLocalData;
            console.log("User Data : ", userData)
            /* User data : 
            username
            socketId
            userId
            */
            const checkUser = await OnlineUsers.findOne({ userId : userData.userId});
            console.log('User:', checkUser);

            ///////////////////////////////////////////////////////////////////////
            // Update the user status to online 
            ///////////////////////////////////////////////////////////////////////
            try {
                if (checkUser) {
                    console.log("1")
                    const updatedUser = await OnlineUsers.findOneAndUpdate({ username: userData.username }, {status: 'online', socketId: socket.id }, { new: true });
                    console.log('User went online:', updatedUser);
                } else {
    
                  const CreateUser = await OnlineUsers.create({ username: userData.username,userId : userData.userId, socketId: socket.id , status: 'online' });
                  console.log("Create user", CreateUser);
                }
            }catch (err) {
                console.error('Error creating user:', err);
            }
          });
          
          ////////////////////////////////////////////////
          // Message handler
          /////////////////////////////////////////////////
          socket.on('Message', async (data) => {
            console.log('Message:', data);
            /*
                message:
                sender: 
                receiver: 
            */
            const receiverData = await OnlineUsers.findOne({userId : data.receiver})
            console.log("receiver : ", receiverData)
            const checkConversation = await Conversation.find({
                $or: [
                    { receiver: data.receiver, sender: data.sender }, 
                    { receiver: data.sender, sender: data.receiver }
                ]
            });
            io.to(receiverData.socketId).emit("PrivateMessage", { from: data.sender, message: data.message });

        });
        




        socket.on('disconnect', async () => {
            console.log("Socket ID : ",socket.id)
        
            try {
                const offlineUser = await OnlineUsers.updateOne({ socketId: socket.id }, { status: 'offline' });
                console.log('User went offline:');
            } catch (err) {
                console.error('Error deleting user:', err);
            }
        });
        
    });
};
