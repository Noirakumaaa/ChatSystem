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
    if (req.url.startsWith("/_next")) {
      handler(req, res);
    } else {
      handler(req, res);
    }
  });

  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    if (socket.id)
      socket.on("user", async (data) => {
        console.log("Data : ", data);
        const userData = data;

        if (userData) {
          await prisma.users.update({
            where: {
              id: userData.id,
            },
            data: {
              socketId: socket.id,
            },
          });

          //console.log("Updated User : ", updateUser.socketId);
          //console.log("Current Socket ID : ", socket.id)
        }
      });

    socket.on("Message", async (data) => {
      console.log("Data : ",data)
      const { sender, receiver, message } = data;
      const findConversation = await prisma.conversation.findFirst({
        where: {
          participants: {
            hasEvery: [sender, receiver],
          },
        },
      });
      console.log("1",findConversation)
      const receiverSocketID = await prisma.users.findUnique({
        where : {
          id : receiver
        }
      })
      console.log("2",receiverSocketID)

      if (!findConversation) {
        const createNewConversation = await prisma.conversation.create({
          data: {
            participants: [sender, receiver],
            lastMessage: "",
          },
        });
        console.log("3",receiverSocketID)

        const NewMessage = await prisma.messages.create({
          data: {
            conversationID: createNewConversation.id,
            sender: sender,
            receiver: receiver,
            message: message,
            time: new Date(),
            status: "Delivered",
          },
        });
        console.log("4",NewMessage)
        io.to(receiverSocketID.socketId).emit("SendMessage", {NewMessage});
      }else{
        const NewMessagee = await prisma.messages.create({
          data: {
            conversationID: findConversation.id,
            receiver: receiver,
            sender: sender,
            message: message,
            time: new Date(),
            status: "Delivered",
          },
        });
        console.log("5",NewMessagee)
        io.to(receiverSocketID.socketId).emit("SendMessage", {NewMessagee});
      }

    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
