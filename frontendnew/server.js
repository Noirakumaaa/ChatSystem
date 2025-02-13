import { createServer } from "http";
import next from "next";
import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const prisma = new PrismaClient();

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handler(req, res);
  });

  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("user", async (data) => {
      //console.log("Data:", data);
      if (!data?.id) return;

      try {
        const UpdatedUser =await prisma.users.update({
          where: { id: data.id },
          data: { socketId: socket.id,status:"Online"},
        });
        //console.log("UpdateUser : ",UpdatedUser )
      } catch (error) {
        //console.error("Error updating socketId:", error);
      }
    });

    socket.on("Message", async (data) => {
      //console.log("Data:", data);
      const { sender, receiver, message } = data;
      
      try {
        const findConversation = await prisma.conversation.findFirst({
          where: {
            participants: { hasEvery: [sender, receiver] },
          },
        });

        const receiverUser = await prisma.users.findUnique({
          where: { id: receiver },
          select: { socketId: true },
        });

        if (!receiverUser) {
          //console.log(`Receiver user ${receiver} not found.`);
          return;
        }

        let conversationID;
        if (!findConversation) {
          const newConversation = await prisma.conversation.create({
            data: { participants: [sender, receiver], lastMessage: "" },
          });
          conversationID = newConversation.id;
        } else {
          conversationID = findConversation.id;
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
        //console.error("Error handling message:", error);
      }
    });

    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);

      try {
        const currentUser = await prisma.users.findFirst({
          where: { socketId: socket.id },
        });

        if (!currentUser) {
          console.log("User not found in database.");
          return;
        }

        await prisma.users.update({
          where: { id: currentUser.id },
          data: { status: "Offline" },
        });

        console.log(`User ${currentUser.id} ${currentUser.username} set to Offline.`);
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
