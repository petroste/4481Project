const express = require('express');
const cors = require('cors');
const db = require("./models");
const { socket } = require('./sockets')

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
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/authClient.routes')(app);

const uri = process.env.ATLAS_URI;
db.mongoose.connect(uri, { useNewUrlParser: true })
    .then(() => {
        console.log("Mongo db connection established successfully");
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

socket(http)
http.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
