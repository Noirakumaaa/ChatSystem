import { createServer } from "http";
import next from "next";
import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const PORT = 3000;
const HOST = "192.168.16.107";

const prisma = new PrismaClient();

const app = next({ dev, HOST, PORT });
const handler = app.getRequestHandler();

const onlineUsers = new Map(); // FIXED

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: { origin: `http://${HOST}:${PORT}` },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("user", async (data) => {
      console.log("Data : ", data.id);
      try {
        const updatedUser = await prisma.users.update({
          where: { id: data.id },
          data: { socketId: socket.id, status: "Online" },
        });

        onlineUsers.set(updatedUser.socketId, {
          socketId: updatedUser.socketId,
          username: updatedUser.username,
          status: "Online",
        });

        io.emit("userUpdate", Array.from(onlineUsers.values())); // Send to all users
      } catch (error) {
        console.error("Error updating socketId:", error);
      }
    });

    socket.on("Message", async (data) => {
      const { sender, receiver, message } = data;
      console.log("Message : ", data);

      try {
        const findConversation = await prisma.conversation.findFirst({
          where: { participants: { hasEvery: [sender, receiver] } },
        });

        const receiverUser = await prisma.users.findUnique({
          where: { id: receiver },
          select: { socketId: true },
        });

        if (!receiverUser?.socketId) return;

        let conversationID = findConversation?.id;
        if (!conversationID) {
          const newConversation = await prisma.conversation.create({
            data: { participants: [sender, receiver], lastMessage: "" },
          });
          conversationID = newConversation.id;
        }

        const newMessage = await prisma.messages.create({
          data: {
            conversationID,
            sender,
            receiver,
            message,
            time: new Date(),
            status: "Delivered",
          },
        });

        io.to(receiverUser.socketId).emit("SendMessage", { newMessage });
      } catch (error) {
        console.error("Error handling message:", error);
      }
    });

    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);

      try {
        const currentUser = await prisma.users.findFirst({
          where: { socketId: socket.id },
        });

        if (currentUser) {
          onlineUsers.delete(socket.id);
          await prisma.users.update({
            where: { id: currentUser.id },
            data: { status: "Offline" },
          });
          io.emit("userUpdate", Array.from(onlineUsers.values()));
        }
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    });
  });

  httpServer.listen(PORT, HOST, () => {
    console.log(`> Ready on http://${HOST}:${PORT}`);
  });
});
