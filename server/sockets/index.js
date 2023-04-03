const fs = require("fs");
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
            origin: "https://helpdesk.sidharth.me/"
        },
        maxHttpBufferSize: 1e8 // 100 MB
    });

    // middleware
    socketIO.use(async (socket, next) => {
        const sessionID = socket.handshake.auth.sessionID;
        if (sessionID) {
            // find existing session
            const session = await sessionStore.findSession(sessionID);

            if (session) {
                console.log("found existing session: " + JSON.stringify(session))
                socket.sessionID = sessionID;
                socket.userID = session.userID;
                socket.userName = session.userName;
                socket.role = session.role;
                return next();
            }
        }
        console.log("Creating new session for " + socket.handshake.auth.userName)
        const userName = socket.handshake.auth.userName;
        const role = socket.handshake.auth.role;
        if (!userName) {
            return next(new Error("invalid username"));
        }
        // create new session
        const newSession = {
            id: randomId(),
            userID: randomId(),
            userName: userName,
            role: role
        }
        socket.sessionID = newSession.id
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
            connected: true,
        });

        socket.emit("session", {
            sessionID: socket.sessionID,
            userID: socket.userID,
            role: socket.role,
            userName: socket.userName
        });

        if (socket.role == "Agent") {
            authenticatedUsers.set(socket.userName, []);
            console.log(Array.from(authenticatedUsers.values()));
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
                messages: messagesPerUser.get(session.userID) || [],
                connected: session.connected
            });
        })


        socket.emit("users", users);
        socket.broadcast.emit("users", users)

        // notify existing users
        // socket.broadcast.emit("user connected", {
        //     userID: socket.userID,
        //     userName: socket.userName,
        //     role: socket.role,
        //     messages: [],
        //     connected: true,
        // });

        socket.emit("refresh");
        socket.broadcast.emit("refresh");

        console.log(`⚡: ${socket.id} ${socket.userName} just connected!`);

        socket.on("customerReassigned", ({ originalAgent, targetAgent, customer }) => {
            socket.emit("customerReassigned", { originalAgent, targetAgent, customer });
            socket.broadcast.emit("customerReassigned", { originalAgent, targetAgent, customer });
        })

        socket.on('message', ({ content, to }) => {
            const message = {
                content,
                from: socket.userID,
                to,
            }
            socket.to(to).to(socket.userID).emit('messageResponse', message)
            messageStore.saveMessage(message);
        });

        socket.on("upload", ({ data, from, to }) => {
            fs.writeFile(
                "upload/" + "test.png",
                data,
                { encoding: "base64" },
                (err) => {
                    if (err) {
                        console.log("Error writing file:", err);
                        return;
                    }
                }
            );

            const message = {
                content: data.toString("base64"),
                from: socket.userID,
                to,
                type: "file",
            };

            if (data.startsWith("data:image/jpeg") || data.startsWith("data:image/png")) {
                message.type = "image";
            }

            socket.to(to).to(socket.userID).emit("confirmUpload", message);

        });

        // notify users upon disconnection
        socket.on("disconnect", async () => {
            const matchingSockets = await socketIO.in(socket.userID).allSockets();
            const isDisconnected = matchingSockets.size === 0;
            if (isDisconnected) {
                // notify other users
                socket.broadcast.emit("user disconnected", socket.userID);
                // update the connection status of the session
                sessionStore.saveSession(socket.sessionID, {
                    userID: socket.userID,
                    userName: socket.userName,
                    role: socket.role,
                    connected: false,
                });
            }
        });

        // socket.on('disconnect', async () => {
        //     const matchingSockets = await socketIO.in(socket.userID).allSockets();
        //     const isDisconnected = matchingSockets.size === 0;
        //     console.log('🔥: A user disconnected');
        //     if (socket.role == "Agent") {
        //         users.pop(socket.userID);
        //         console.log(users);
        //         socket.emit("users", users);
        //         socket.broadcast.emit("users", users);

        //         authenticatedUsers.delete(socket.userName);
        //     }
        //     if (isDisconnected) {
        //         // Remove user from all rooms
        //         matchingSockets.forEach((socket) => {
        //             socket.leaveAll();
        //         });
        //         // Remove user's session from session store
        //         sessionStore.removeSession(socket.sessionID);
        //         // notify other users
        //         socket.broadcast.emit("user disconnected", socket.userID);
        //     }
        // });
    });

}
module.exports = { socket: socket, authenticatedUsers: authenticatedUsers }