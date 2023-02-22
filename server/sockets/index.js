const { InMemorySessionStore } = require("./sessionStore");
const { InMemoryMessageStore } = require('./messageStore')
const crypto = require('crypto');
const sessionStore = new InMemorySessionStore();
const messageStore = new InMemoryMessageStore();
const randomId = () => crypto.randomBytes(8).toString("hex");
const authenticatedUsers = new Map();

function socket(http) {
    const socketIO = require('socket.io')(http, {
        cors: {
            origin: "http://localhost:3000"
        }
    });

    // middleware
    socketIO.use((socket, next) => {
        const sessionID = socket.handshake.auth.sessionID;
        if (sessionID) {
            // find existing session
            const session = sessionStore.findSession(sessionID);

            if (session) {
                socket.sessionID = sessionID;
                socket.userID = session.userID;
                socket.username = session.username;
                return next();
            }
        }
        const userName = socket.handshake.auth.userName;
        const role = socket.handshake.auth.role;
        if (!userName) {
            return next(new Error("invalid username"));
        }
        // create new session
        const newSession = {
            userID: randomId(),
            userName: userName,
            role: role
        }
        const newSessionID = randomId()
        socket.sessionID = newSessionID
        socket.userID = newSession.userID
        socket.userName = newSession.userName
        socket.role = newSession.role
        // store new session
        next();
    });

    socketIO.on('connection', async (socket) => {
        // persist session
        sessionStore.saveSession(socket.sessionID, {
            userID: socket.userID,
            userName: socket.userName,
            role: socket.role,
        });

        socket.emit("session", {
            sessionID: socket.sessionID,
            userID: socket.userID,
            role: socket.role
        });

        if (socket.role == "Agent")
        {
            authenticatedUsers.set(socket.userName, []);
            console.log (Array.from(authenticatedUsers.values()));
        }

        // join the userID room
        socket.join(socket.userID);
        // listing all users
        const users = []
        const [messages, sessions] = await Promise.all([
            messageStore.findMessagesForUser(socket.userID),
            sessionStore.findAllSessions(),
        ]);
        const messagesPerUser = new Map();
        messages.forEach((message) => {
            const { from, to } = message;
            const otherUser = socket.userID === from ? to : from;
            if (messagesPerUser.get(otherUser)) {
                messagesPerUser.get(otherUser).push(message);
            } else {
                messagesPerUser.set(otherUser, [message]);
            }
        });


        sessions.forEach((session) => {
            users.push({
                userID: session.userID,
                userName: session.userName,
                role: session.role,
                messages: messagesPerUser.get(session.userID) || []
            });
        })


        socket.emit("users", users);

        // notify existing users
        socket.broadcast.emit("users", users);

        console.log(`⚡: ${socket.id} ${socket.userName} just connected!`);

        socket.on('message', ({ content, to }) => {
            const message = {
                content,
                from: socket.userID,
                to,
            }
            socket.to(to).to(socket.userID).emit('message', message)
            messageStore.saveMessage(message);
        });

        socket.on('disconnect', async () => {
            const matchingSockets = await socketIO.in(socket.userID).allSockets();
            const isDisconnected = matchingSockets.size === 0;
            console.log('🔥: A user disconnected');
            if (socket.role == "Agent")
            {
                users.pop(socket.userID);
                console.log(users);
                socket.emit("users", users);
                socket.broadcast.emit("users", users);

                authenticatedUsers.delete(socket.userName);
            }
            if (isDisconnected) {
                // Remove user from all rooms
                matchingSockets.forEach((socket) => {
                     socket.leaveAll();
                 });
                // Remove user's session from session store
                sessionStore.removeSession(socket.sessionID);
                // notify other users
                socket.broadcast.emit("user disconnected", socket.userID);
            }
        });
    });

}
module.exports = { socket: socket, authenticatedUsers: authenticatedUsers }