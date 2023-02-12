const express = require ('express');
const cors = require ('cors');
const chatsRouter = require ('./routes/chats');
const usersRouter = require ('./routes/users');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB db connection established successfully");
});

app.use('/chats', chatsRouter);
app.use('/users', usersRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})