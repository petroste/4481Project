const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.users = require("./useragents.model");
db.chats = require("./chats.model");

module.exports = db;