const mongoose = require ('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema ({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 8,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    activeChats: { type: [String]}
}, {
    timestamps: true,
});

const Users = mongoose.model('Users', userSchema);
module.exports = Users;