const express = require ('express');
const cors = require ('cors');
const db = require ("./models");

require('dotenv').config();

const app = express();
const http = require('http').Server(app);

//var corsOptions = {
//    origin: "http://localhost:8081"
//  };
const port = process.env.PORT || 4000;

//app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
let users = [];
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hello, this is our chatapp" });
});
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    
    socket.on('message', (data) => {
        console.log(data);
        socketIO.emit('messageResponse', data);
    });
    socket.on('newUser', (data) => {
        users.push(data);
        socketIO.emit('newUserResponse', users);
    })
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
      users = users.filter((user) => user.socketID !== socket.id);
      socketIO.emit('newUserResponse', users);
      socket.disconnect();
    });
});

const uri = process.env.ATLAS_URI;
db.mongoose.connect(uri, {useNewUrlParser: true})
    .then(() => {
        console.log("Mongo db connection established successfully");
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

http.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
