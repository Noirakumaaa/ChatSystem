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
    server.listen(process.env.PORT || 5000, "0.0.0.0", () => { // Fixed syntax
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.log('MongoDB connection error:', err));
