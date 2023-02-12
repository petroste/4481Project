const router = require('express').Router();
let Chat = require ('../models/chats.model');

router.route('/').get((req, res) => {
    Chat.find()
        .then(chats => res.json(chats))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const sender = Number(req.body.sender);
    const receiver = Number(req.body.receiver);
    const message = req.body.message;

    const newChat = new Chat ({ChatID, sender, receiver, message});

    newChat.save()
        .then(() => res.json('Chat Added!'))
        .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;