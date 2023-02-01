const express = require('express');
const app = express();
const PORT = 4000;

// import libs
const http = require('http').Server(app);
const cors = require('cors');
const socketIO = require('socket.io')(http, {cors: {origin: "http://localhost:5000"}});

socketIO.on('connection', (socket) => {
    console.log(`${socket.id} user just connected!`);
    socket.on('disconnect', () => {
    console.log('A user disconnected');
    });  
});

app.get('/api', (req, res) => {
    res.json({
        message: 'Hello world',
    });
});

app.listen(PORT, () => {console.log(`Server listening on ${PORT}`);});