const Users = require("../model/Users.model");
const Message = require("../model/Message.model");
const Conversation = require("../model/Conversation.model");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket Connected: ", socket.id);

    // 🟢 Handle User Connection
    socket.on("User", async (data) => {
      const userData = data.userLocalData;
      console.log("User Data:", userData);

      try {
        // ✅ Check if user exists in the database
        const CurrentUser = await Users.findOne({
          username: userData.username,
          _id: userData.userId,
        });

        if (CurrentUser) {
          // ✅ Update existing user status & socketId
          await Users.findOneAndUpdate(
            { _id: userData.userId },
            {
              socketId: socket.id,
              status: "Online",
            }
          );
        } else {
          // ✅ If user doesn't exist, create a new user record
          await Users.findOneAndUpdate(
            { _id: userData.userId },
            {
              socketId: socket.id,
              status: "Online",
            },
            { upsert: true } // Creates a new user if not found
          );
        }

        // ✅ Notify the user they have logged in
        io.to(socket.id).emit("login", { socketId: socket.id, user: 1 });
      } catch (err) {
        console.error("Error updating user status:", err);
      }
    });

    // 🟢 Handle Message Sending
    socket.on("Message", async (data) => {
      console.log("Message Received:", data);

      try {
        // ✅ Check if a conversation already exists between the two users
        let conversation = await Conversation.findOne({
          participants: { $all: [data.sender, data.receiver] },
          $expr: { $eq: [{ $size: "$participants" }, 2] },
        });

        if (!conversation) {
          // ✅ Create a new conversation if it doesn't exist
          conversation = await Conversation.create({
            participants: [data.sender, data.receiver],
            lastMessage: data.message,
          });
        }

        // ✅ Save the new message to the database
        const newMessage = await Message.create({
          conversationID: conversation._id,
          sender: data.sender,
          receiver: data.receiver,
          message: data.message,
        });

        // ✅ Update the last message in the conversation
        await Conversation.findByIdAndUpdate(conversation._id, {
          lastMessage: newMessage.message,
        });

        // ✅ Find the receiver's socket ID
        const receiver = await Users.findOne({ _id: data.receiver });

        if (receiver && receiver.socketId) {
          // ✅ Send the message to the receiver if they are online
          io.to(receiver.socketId).emit("PrivateMessage", {
            from: data.sender,
            message: data.message,
          });
        }
      } catch (err) {
        console.error("Error handling message:", err);
      }
    });

    // 🟢 Handle User Disconnection
    socket.on("disconnect", async () => {
      console.log("Socket Disconnected: ", socket.id);

      try {
        // ✅ Set user status to offline
        await Users.updateOne({ socketId: socket.id }, { status: "offline" });

        // ✅ Notify others that the user has gone offline
        io.to(socket.id).emit("login", { socketId: socket.id, user: -1 });
      } catch (err) {
        console.error("Error updating user status to offline:", err);
      }
    });
  });
};
