const mongoose = require ('mongoose');

const Schema = mongoose.Schema;

const chatsSchema = new Schema ({
    sender: {
        type: Number,
        required: true,
    },
    receiver: {
        type: Number,
        required: true,
    },
    message: {
        type: String
    }
    
}, {
    timestamps: true,
});

const Chats = mongoose.model('Chats', chatsSchema);
module.exports = Chats;