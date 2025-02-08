const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');


const socketSetup = require('./component/socket');

const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});


require('dotenv').config();

const userRoutes = require('./controller/Users.controller');
const convoRoutes = require('./controller/conversation.controller');


app.use(cors({
  origin: "*",  // Your frontend's local IP
}));
app.use(bodyParser.json());



socketSetup(io);


app.use('/api/users', userRoutes);
app.use('/api/conversation', convoRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(process.env.PORT, "0.0.0.0", () => { 
      console.log(`Server running on:
        - Local: http://localhost:${process.env.PORT}
        - Network: http://${getLocalIP()}:${process.env.PORT}`);
    });
  })
  .catch((err) => console.log('MongoDB connection error:', err));


  function getLocalIP() {
    const os = require("os");
    const networkInterfaces = os.networkInterfaces();
    for (const key in networkInterfaces) {
      for (const net of networkInterfaces[key]) {
        if (net.family === "IPv4" && !net.internal) {
          return net.address;
        }
      }
    }
    return "127.0.0.1";  // Default to localhost
  }