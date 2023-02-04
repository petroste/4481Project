const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

// import libs
const http = require('http').Server(app);
const cors = require('cors');
const socketIO = require('socket.io')(http, {cors: {origin: "http://localhost:8080"}});

socketIO.on('connection', (socket) => {
    console.log(`${socket.id} user just connected!`);
    socket.on('disconnect', () => {
    console.log('A user disconnected');
    });  
});

app.post('/post', (req, res) => {
    res.json({
        message: 'Hello world',
    });
});

app.listen(PORT, console.log(`Server listening on ${PORT}`));