import { createServer } from "http";
import next from "next";
import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const prisma = new PrismaClient()

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
        const userData = data.id;
      
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
      


      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
